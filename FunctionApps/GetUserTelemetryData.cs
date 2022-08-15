using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class TelemetryInfo
    {
        // Unique identifier of the device
        public string DeviceId { get; set; }
        // SubId for the device, the number of the PIR
        public int PirId { get; set; }
        // The Value detected by the device
        public double value { get; set; }
        // unix miliseconds (since 1970-01-01)
        public long time { get; set; }
        // Device friendly name gave by the user
        public string DeviceName { get; set; }
        // Device location specified by the user
        public string Location { get; set; }
        // UserId (username) of the device owner
        public string UserId { get; set; }
    }

    public static class GetUserTelemetryData
    {
        [FunctionName("GetUserTelemetryData")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            [Table("Users", Connection = "AzureWebJobsStorage")] CloudTable userTable,
            [Table("Devices", Connection = "AzureWebJobsStorage")] CloudTable deviceTable,
            [Table("DeviceTelemetries", Connection = "AzureWebJobsStorage")] CloudTable telemetryTable,
            ILogger log)
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            string userId = query.Get("UserId");
            string deviceId = query.Get("DeviceId");

            if (userId == null && deviceId == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            string[] deviceIdx = deviceId == null
                ? Array.ConvertAll(
                    await DeviceFunctions.GetUserDevices(deviceTable, userId),
                    device => device.DeviceId)
                : new string[] { deviceId };
            log.LogInformation($"{deviceId} -> {deviceIdx.Length}");
            List<TelemetryInfo> telemetryEntities = new List<TelemetryInfo>();
            foreach (string id in deviceIdx)
            {
                DeviceEntity deviceData = await DeviceFunctions.GetDeviceEntityById(deviceTable, id);
                TelemetryEntity[] telemetries = await TelemetryUtils.GetDeviceTelemetries(telemetryTable, id);
                log.LogInformation($"\t deviceId={id} -> telemetries count = {telemetries.Length}");
                telemetryEntities.AddRange(Array.ConvertAll(telemetries, tele =>
                {
                    return new TelemetryInfo
                    {
                        DeviceId = id,
                        value = tele.ReadValue,
                        PirId = tele.PirSubId,
                        time = tele.ParseTimeFromRowKey().ToUnixTimeMilliseconds(),
                        DeviceName = deviceData.DeviceName,
                        Location = deviceData.DeviceLocation,
                        UserId = deviceData.User,
                    };
                }));
            }
            var jsonToReturn = JsonConvert.SerializeObject(telemetryEntities);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}
