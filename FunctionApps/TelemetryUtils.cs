using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class TelemetryEntity : TableEntity
    {
        public string DeviceId { get; set; }
        public int PirSubId { get; set; }
        public double ReadValue { get; set; }
        public DateTimeOffset TelemetryTime { get; set; }

        public DateTimeOffset ParseTimeFromRowKey()
        {
            string seconds = RowKey.Split(new[] { '-' }, StringSplitOptions.RemoveEmptyEntries)[0];
            return DateTimeOffset.FromUnixTimeSeconds(long.Parse(seconds));
        }

        /*
        {
            "device":"pir1",
            "data":
            [{
                "pir":1,
                "value":1,
                "time":1659859692
            },{
                "pir":1,
                "value":0,
                "time":1659859694
            }]
        }
        */
        public static List<TelemetryEntity> ParseDeviceEvent(string eventBodyJson, ILogger log)
        {
            var jsonDict = JObject.Parse(eventBodyJson);
            string deviceId = (string)jsonDict["device"];

            var result = ((JArray)jsonDict["data"])
                .Select(
                    tel =>
                        new TelemetryEntity
                        {
                            DeviceId = deviceId,
                            PartitionKey = deviceId,
                            RowKey = (string)tel["time"] + "-" + (string)tel["pir"],
                            PirSubId = (int)tel["pir"],
                            ReadValue = (float)tel["value"],
                            TelemetryTime = DateTimeOffset
                                .FromUnixTimeSeconds((int)tel["time"])
                        }
                )
                .ToList();
            log.LogInformation(result[0].ReadValue.ToString());
            log.LogInformation(result[1].ReadValue.ToString());
            return result;
        }
    }

    internal class TelemetryUtils
    {
        public static async Task<TelemetryEntity[]> GetDeviceTelemetries(
            CloudTable telemetryTable,
            string deviceId
        )
        {
            TableQuery<TelemetryEntity> dbQuery = new TableQuery<TelemetryEntity>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", "eq", deviceId))
                .Select(new string[] { "DeviceId", "PirSubId", "ReadValue" });
            TableQuerySegment<TelemetryEntity> rows =
                await telemetryTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            return rows.Results.ToArray();
        }

        public static async Task<int> UpdateFromRawDataTable(
            CloudTable rawData,
            CloudTable telemetryTable,
            ILogger log
        )
        {
            TableQuery<RawDataEntry> query = new TableQuery<RawDataEntry>().Select(
                new string[] { "Counter", "RawData" }
            );
            TableQuerySegment<RawDataEntry> rows = await rawData.ExecuteQuerySegmentedAsync(
                query,
                null
            );
            var exceptions = new List<Exception>();
            foreach (var row in rows)
            {
                try
                {
                    await InsertTelemtry(telemetryTable, row.RawData, log);
                    await Task.Yield();
                }
                catch (Exception ex)
                {
                    exceptions.Add(ex);
                }
            }
            if (exceptions.Count > 1)
            {
                throw new AggregateException(exceptions);
            }

            if (exceptions.Count == 1)
            {
                throw exceptions.Single();
            }

            return rows.Count();
        }

        public static async Task<int> InsertTelemtry(
            CloudTable telemetryTable,
            string eventBodyJson,
            ILogger log
        )
        {
            var telemetries = TelemetryEntity.ParseDeviceEvent(eventBodyJson, log);
            foreach (var telemetriesEntity in telemetries)
            {
                var operation = TableOperation.Insert(telemetriesEntity);
                await telemetryTable.ExecuteAsync(operation);
            }
            return telemetries.Count();
        }
    }
}
