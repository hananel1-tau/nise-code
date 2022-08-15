using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApps
{
    public static class CreateTelemetry
    {
        [FunctionName("CreateTelemetry")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            [Table("DeviceTelemetries", Connection = "AzureWebJobsStorage")]
                CloudTable telemetryTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idTable,
            ILogger log
        )
        {
            var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            if (
                requestQuery.Get("deviceId") == null
                || requestQuery.Get("pirId") == null
                || requestQuery.Get("timestamp") == null
                || requestQuery.Get("value") == null
            )
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            string deviceId = requestQuery.Get("DeviceId");
            int pirId = int.Parse(requestQuery.Get("PirId"));
            double value = double.Parse(requestQuery.Get("value"));
            int timestamp = int.Parse(requestQuery.Get("timestamp"));

            return await CreateOneTelemetry(
                telemetryTable,
                idTable,
                log,
                deviceId,
                pirId,
                timestamp,
                value
            );
        }

        private static async Task<HttpResponseMessage> CreateOneTelemetry(
            CloudTable userTable,
            CloudTable idTable,
            ILogger log,
            string deviceId,
            int pirId,
            int timestamp,
            double value
        )
        {
            log.LogInformation($"request params = {deviceId}, {pirId}, {timestamp}, {value}");

            // Unix timestamp is seconds past epoch
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(timestamp);
            
            var telemetry = new TelemetryEntity()
            {
                DeviceId = deviceId,
                PirSubId = pirId,
                ReadValue = value,
                PartitionKey = deviceId,
                RowKey = $"{timestamp}-{pirId}",
                TelemetryTime = dateTime,
            };
            var result = await userTable.ExecuteAsync(TableOperation.Insert(telemetry));
            var jsonToReturn = JsonConvert.SerializeObject(telemetry);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}
