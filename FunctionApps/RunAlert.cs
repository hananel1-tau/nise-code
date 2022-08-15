using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace FunctionApps
{

    public class RunAlert
    {
        [FunctionName("RunAlert")]
        public async Task Run(
            [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
            [Table("AlertsConfig", Connection = "AzureWebJobsStorage")] CloudTable alertTable,
            [Table("AlertsEvents", Connection = "AzureWebJobsStorage")] CloudTable alerEventstTable,
            [Table("DeviceTelemetries", Connection = "AzureWebJobsStorage")] CloudTable telemetriesTable,
            [Table("Devices", Connection = "AzureWebJobsStorage")] CloudTable deviceTable,
            ILogger log
        )
        {
            DateTime now = DateTime.Now;
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            TableQuery<AlertEntity> dbQuery = new TableQuery<AlertEntity>()
                .Select(new string[] { "AlertType", "AlertEntityType", "EntityId", "MinutesSinceLast" });
            TableQuerySegment<AlertEntity> alerts = await alertTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            foreach (var alert in alerts)
            {
                if (alert.AlertType.ToLower() == AlertEntity.NO_TELEMETRY_TYPE.ToLower() || true)
                {
                    TelemetryEntity lastTelemetry = await AlertUtils.GetMostRecentTelemetry(alertTable, deviceTable, telemetriesTable, alert.AlertEntityType, alert.EntityId, alert.MinutesSinceLast);
                    if ((now - lastTelemetry.TelemetryTime).TotalMinutes > alert.MinutesSinceLast)
                    {
                        await AlertUtils.createEvent(alerEventstTable, telemetriesTable, alert, lastTelemetry);
                    }
                }
            }
        }

    }
}
