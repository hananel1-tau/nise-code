using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.EventHubs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class RawDataEntry : TableEntity
    {
        public int Counter { get; set; }
        public string RawData { get; set; }

        public static string entryToJsonString(RawDataEntry rawDataEntry)
        {
            var tempJson = JsonConvert.SerializeObject(rawDataEntry);
            var dictData = JsonConvert.DeserializeObject<Dictionary<string, object>>(tempJson);
            string rawStr = dictData["RawData"].ToString();

            // fix json if needed
            if (rawStr[rawStr.Length - 1] != '}')
            {
                dictData["RawData"] += "}";
            }
            dictData["RawData"] = JsonConvert.DeserializeObject<Dictionary<string, object>>(dictData["RawData"].ToString());
            var jsonToReturn = JsonConvert.SerializeObject(dictData);
            return jsonToReturn;
        }

    }

    internal class RawDataUtils
    {
        public static async Task<RawDataEntry> GetNewestRow(CloudTable table, ILogger log)
        {
            log.LogInformation("Getting DB Entries");
            TableQuery<RawDataEntry> query = new TableQuery<RawDataEntry>().Select(new string[] { "Counter", "RawData" });
            var rows = await table.ExecuteQuerySegmentedAsync(query, null);
            log.LogInformation("got rows: " + rows.Count());
            var newestRow = rows.MaxBy(counter => counter.Timestamp);
            log.LogInformation("newest row is from: " + newestRow.RowKey);
            return newestRow;
        }

        public static async Task<TableQuerySegment<RawDataEntry>> GetUserData(CloudTable rawData, string UserId, ILogger log)
        {
            TableQuery<RawDataEntry> query = new TableQuery<RawDataEntry>().Select(new string[] { "Counter", "RawData" });
            TableQuerySegment<RawDataEntry> rows = await rawData.ExecuteQuerySegmentedAsync(query, null);
            return rows;
        }

        public static async Task<int> InsertRawDataEntry(CloudTable table, int value, EventData eventData, ILogger log)
        {
            RawDataEntry counter = new RawDataEntry();
            counter.PartitionKey = "0";
            counter.RowKey = counter.Timestamp.ToString("o");
            counter.Counter = value;
            counter.RawData = Encoding.Default.GetString(eventData.Body);

            log.LogInformation("event propertis are:");
            log.LogInformation("\t" + "Body:" + "\t" + Encoding.Default.GetString(eventData.Body));
            foreach (KeyValuePair<string, object> kvp in eventData.Properties)
            {
                log.LogInformation("\t Property: " + string.Format("Key = {0}, Value = {1}", kvp.Key, kvp.Value));
            }
            log.LogInformation("Inserting new row, id: " + JsonConvert.SerializeObject(counter));

            var operation = TableOperation.Insert(counter);
            await table.ExecuteAsync(operation);
            return value;
        }
    }
}
