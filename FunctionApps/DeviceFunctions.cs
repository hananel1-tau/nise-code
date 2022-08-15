using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace FunctionApps
{
    public class DeviceEntity : TableEntity
    {
        public string User { get; set; }
        public string DeviceId { get; set; }
        public string DeviceLocation { get; set; }
        public string DeviceName { get; set; }
    }

    public static class DeviceFunctions
    {
        [FunctionName("Device")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [Table("Devices", Connection = "AzureWebJobsStorage")] CloudTable deviceTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idTable,
            ILogger log)
        {
            var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            string userId = requestQuery.Get("UserId");
            string deviceId = requestQuery.Get("DeviceId");
            string location = requestQuery.Get("DeviceLocation");
            string name = requestQuery.Get("DeviceName");
            if (req.Method == HttpMethod.Post.ToString())
            {
                return await CreateDevice(deviceTable, idTable, log, userId, deviceId, location, name);
            }
            else
            {
                return await GetDevice(deviceTable, log, userId, deviceId);
            }
        }

        private static async Task<HttpResponseMessage> CreateDevice(CloudTable deviceTable, CloudTable idTable, ILogger log, string userId, string deviceId, string location, string name)
        {
            var checkExists = await GetDeviceEntityById(deviceTable, deviceId);
            if (userId == null || deviceId == null || location == null || name == null || checkExists != null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            log.LogInformation("Got Here");
            var device = new DeviceEntity()
            {
                User = userId,
                DeviceId = deviceId,
                DeviceLocation = location,
                DeviceName = name,
                PartitionKey = "global",
                RowKey = (await IdUtils.GetNewId(idTable, "user", log)).ToString(),
            };
            var result = await deviceTable.ExecuteAsync(TableOperation.Insert(device));
            var jsonToReturn = JsonConvert.SerializeObject(device);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }

        private static async Task<HttpResponseMessage> GetDevice(CloudTable deviceTable, ILogger log, string userId, string deviceId)
        {
            if (userId == null && deviceId == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            if (deviceId != null)
            {
                DeviceEntity device = await GetDeviceEntityById(deviceTable, deviceId);
                if (device == null)
                {
                    return new HttpResponseMessage(HttpStatusCode.NoContent);
                }
                else
                {
                    var jsonToReturn = JsonConvert.SerializeObject(device);
                    return new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
                    };
                }
            }
            else
            {
                DeviceEntity[] userDevices = await GetUserDevices(deviceTable, userId);
                var jsonToReturn = JsonConvert.SerializeObject(userDevices);
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
                };
            }
        }

        public static async Task<DeviceEntity[]> GetUserDevices(CloudTable deviceTable, string userId)
        {
            TableQuery<DeviceEntity> dbQuery = new TableQuery<DeviceEntity>()
                            .Where(TableQuery.GenerateFilterCondition("User", "eq", userId))
                            .Select(new string[] { "User", "DeviceId", "DeviceLocation", "DeviceName" });
            TableQuerySegment<DeviceEntity> rows = await deviceTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            return rows.Results.ToArray();
        }

        public static async Task<DeviceEntity> GetDeviceEntityById(CloudTable deviceTable, string deviceId)
        {
            TableQuery<DeviceEntity> dbQuery = new TableQuery<DeviceEntity>()
                            .Where(TableQuery.GenerateFilterCondition("DeviceId", "eq", deviceId))
                            .Select(new string[] { "User", "DeviceId", "DeviceLocation", "DeviceName" })
                            .Take(1);
            TableQuerySegment<DeviceEntity> rows = await deviceTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            return rows.Results.Count > 0 ? rows.Results[0] : null;
        }
    }
}
