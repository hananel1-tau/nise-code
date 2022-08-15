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
    public static class AlertFunctions
    {
        [FunctionName("Alert")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
                HttpRequest req,
            [Table("AlertsConfig", Connection = "AzureWebJobsStorage")] CloudTable alertsTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idTable,
            ILogger log
        )
        {
            if (req.Method == HttpMethod.Post.ToString())
            {
                var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
                string alertType = requestQuery.Get("alertType");
                string alertEntityType = requestQuery.Get("alertEntityType");
                string entityId = requestQuery.Get("entityId");
                int minutesBack = int.Parse(requestQuery.Get("minutesBack"));
                return await CreateAlert(
                    alertsTable,
                    idTable,
                    log,
                    alertType,
                    alertEntityType,
                    entityId,
                    minutesBack
                );
            }
            else
            {
                return await GetAllAlerts(alertsTable);
            }
        }

        private static async Task<HttpResponseMessage> CreateAlert(
            CloudTable alertsTable,
            CloudTable idTable,
            ILogger log,
            string alertType,
            string alertEntityId,
            string entityId,
            int minutesBack
        )
        {
            if (alertType == null || alertEntityId == null || entityId == null || minutesBack <= 0)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            log.LogInformation("Got Here");
            var alert = new AlertEntity()
            {
                AlertType = alertType,
                AlertEntityType = alertEntityId,
                EntityId = entityId,
                MinutesSinceLast = minutesBack,
                PartitionKey = "global",
                RowKey = (await IdUtils.GetNewId(idTable, "user", log)).ToString(),
            };
            var result = await alertsTable.ExecuteAsync(TableOperation.Insert(alert));
            var jsonToReturn = JsonConvert.SerializeObject(alert);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }

        private static async Task<HttpResponseMessage> GetAllAlerts(CloudTable alertsTable)
        {
            TableQuery<AlertEntity> dbQuery = new TableQuery<AlertEntity>()
                            .Select(new string[] { "AlertType", "AlertEntityType", "EntityId", "MinutesSinceLast" });
            TableQuerySegment<AlertEntity> rows = await alertsTable.ExecuteQuerySegmentedAsync(dbQuery, null);

            var jsonToReturn = JsonConvert.SerializeObject(rows.Results.ToArray());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}
