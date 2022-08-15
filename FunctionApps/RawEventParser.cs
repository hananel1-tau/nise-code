using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class RawEventParser
    {
        [FunctionName("RawEventParser")]
        public async Task Run(
            [EventHubTrigger("ioteventhub", Connection = "EventHubConnectionAppSetting")] EventData[] events,
            [Table("RawDeviceData", Connection = "AzureWebJobsStorage")] CloudTable rawDataTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idsData,
            [Table("DeviceTelemetries", Connection = "AzureWebJobsStorage")] CloudTable telemetryTable,
            ILogger log)
        {
            log.LogInformation($"C# Event Hub trigger function called, events = {events.Length}");

            var exceptions = new List<Exception>();

            foreach (EventData eventData in events)
            {
                try
                {
                    var counterValue = (await IdUtils.GetNewId(idsData, IdUtils.DEFAULT_ROWKEY, log));
                    await RawDataUtils.InsertRawDataEntry(rawDataTable, counterValue, eventData, log);
                    string body = Encoding.Default.GetString(eventData.Body);
                    await TelemetryUtils.InsertTelemtry(telemetryTable, body, log);
                    await Task.Yield();
                }
                catch (Exception e)
                {
                    // We need to keep processing the rest of the batch - capture this exception and continue.
                    // Also, consider capturing details of the message that failed processing so it can be processed again later.
                    exceptions.Add(e);
                }
            }

            // Once processing of the batch is complete, if any messages in the batch failed processing throw an exception so that there is a record of the failure.

            if (exceptions.Count > 1)
            {
                throw new AggregateException(exceptions);
            }

            if (exceptions.Count == 1)
            {
                throw exceptions.Single();
            }
        }
    }
}
