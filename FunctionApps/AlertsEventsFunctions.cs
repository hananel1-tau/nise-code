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
    public static class AlertsEventsFunctions
    {
        [FunctionName("AlertsEvents")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
                HttpRequest req,
            [Table("AlertsEvents", Connection = "AzureWebJobsStorage")] CloudTable alertsEventsTable,
            ILogger log
        )
        {
            TableQuery<AlertEventEntity> dbQuery = new TableQuery<AlertEventEntity>()
                            .Select(new string[] { "AlertId", "EventMessage", "StartTime", "ResolveTime", "Resolved" });
            TableQuerySegment<AlertEventEntity> rows = await alertsEventsTable.ExecuteQuerySegmentedAsync(dbQuery, null);

            var jsonToReturn = JsonConvert.SerializeObject(rows.Results.ToArray());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}
