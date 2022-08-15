using Microsoft.Azure.Cosmos.Table;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class AlertEntity : TableEntity
    {
        public static readonly string NO_TELEMETRY_TYPE = "notelemetry";
        // determines the logic the alert runs, we only have one so it doesn't matter,
        // it cant be empty though
        public string AlertType { get; set; }
        // The logic can run on onr device or all of user devices
        // for user this ield should contain "user", "device" for device
        public string AlertEntityType { get; set; }
        // the userId or the deviceId for the telemetries
        public string EntityId { get; set; }
        // This decides how long to wait with no telemetry
        public int MinutesSinceLast { get; set; }
        /*EXAMPLE
         * for these parameters:
         * AlertType	    "NoTelemtry"
         * AlertEntityType	"device"
         * EntityId	        "pir1"
         * MinutesSinceLast	300
         * 
         * The logic would look for telemetries from the device "pir1" 
         * and create an AlertEvent if 300 minutes passed with no telemetry 
         * (looking from now 300 to the past)
         */
    }

    public class AlertEventEntity : TableEntity
    {
        /*
         * This class represents an event where an alert was issued
         * I add support to mark events as resolved, and document the resolution time 
         * (using the ResolveEvent API)
         */

        // the id of the relevant alert
        public string AlertId { get; set; }
        // some generic message, The beckend leaves it empty
        public string EventMessage { get; set; }
        // the time of the last telemetry relevant to the alert rule 
        // This is not the creation time of the event, This can be found in the Timestamp field
        public DateTimeOffset StartTime { get; set; }
        // resolution time of the event, equals 1970-1-1 if the event is not resolved
        public DateTimeOffset ResolveTime { get; set; }
        // true is the event was resolved otherwise false
        public bool Resolved { get; set; }

        public static DateTime GetNoResolveTime() { return new DateTime(1970, 1, 1); }
    }

    internal class AlertUtils
    {
        public static async Task<int> createEvent(CloudTable alertEvents, CloudTable telemetriesTable, AlertEntity alert, TelemetryEntity lastTelemetry)
        {
            var alertEntiry = new AlertEventEntity()
            {
                PartitionKey = "global",
                RowKey = $"{alert.RowKey}-{lastTelemetry.RowKey}",
                AlertId = $"{alert.RowKey}",
                StartTime = lastTelemetry.TelemetryTime.DateTime,
                ResolveTime = AlertEventEntity.GetNoResolveTime(),
                Resolved = false
            };
            try
            {
                var result = await alertEvents.ExecuteAsync(TableOperation.Insert(alertEntiry));
                return result.HttpStatusCode;
            }
            catch (StorageException)
            {

                Console.WriteLine("Tried to create an event but failed, oops");
                return -1;
            }
        }

        public static async Task<AlertEventEntity> resolveEvent(CloudTable alertEvents, string rowKey)
        {
            var row = (await alertEvents.ExecuteAsync(TableOperation.Retrieve("global", rowKey)));
            var EventEntity = (AlertEventEntity)row.Result;
            EventEntity.ResolveTime = DateTime.Now;
            EventEntity.Resolved = true;
            var result = await alertEvents.ExecuteAsync(TableOperation.Replace(EventEntity));
            return EventEntity;
        }


        public static async Task<int> createOrReplaceAlert(CloudTable alertTable, string alertType, string alertEntityType, string entityId, int minutesSinceLast)
        {
            var alert = new AlertEntity()
            {
                PartitionKey = "global",
                RowKey = $"{alertEntityType}-{entityId}",
                AlertType = alertType,
                AlertEntityType = alertEntityType,
                EntityId = entityId,
                MinutesSinceLast = minutesSinceLast
            };

            var result = await alertTable.ExecuteAsync(TableOperation.InsertOrReplace(alert));
            return result.HttpStatusCode;
        }

        public static async Task<TelemetryEntity> GetMostRecentTelemetry(
            CloudTable alertTable,
            CloudTable deviceTable,
            CloudTable telemetriesTable,
            string entityType,
            string entityId,
            int minutesBack
        )
        {
            if (entityType.ToLower() != "user" && entityType.ToLower() != "device")
            {
                return null;
            }

            string[] deviceIdx =
                entityType.ToLower() == "user"
                    ? Array.ConvertAll(
                        await DeviceFunctions.GetUserDevices(deviceTable, entityId),
                        device => device.DeviceId
                    )
                    : new string[] { entityId };
            string deviceFilter = Array
                .ConvertAll(
                    deviceIdx,
                    id => TableQuery.GenerateFilterCondition("DeviceId", "eq", id)
                )
                .Aggregate((a, b) => TableQuery.CombineFilters(a, "or", b));

            TableQuery<TelemetryEntity> dbQuery = new TableQuery<TelemetryEntity>()
                .Where(deviceFilter)
                .Select(new string[] { });
            TableQuerySegment<TelemetryEntity> rows = await telemetriesTable.ExecuteQuerySegmentedAsync(
                dbQuery,
                null
            );
            return rows.Results.MaxBy(tel => tel.TelemetryTime);
        }
    }
}
