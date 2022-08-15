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

    public static class GetUserData
    {
        [FunctionName("GetRawDataJson")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [Table("DeviceTelemetries", Connection = "AzureWebJobsStorage")] CloudTable telemetriesTable,
            ILogger log)
        {
            var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            int minutesBack = int.Parse(requestQuery.Get("minutesBack"));
            string dateFilter = TableQuery.GenerateFilterConditionForDate("TelemetryTime", "ge", DateTime.Now.AddMinutes(-minutesBack));

            TableQuery<TelemetryEntity> dbQuery = new TableQuery<TelemetryEntity>()
                .Where(dateFilter)
                .Select(new string[] { "DeviceId", "PirSubId", "ReadValue" });
            var rows = await telemetriesTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            var jsonToReturn = JsonConvert.SerializeObject(rows.Results);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}

