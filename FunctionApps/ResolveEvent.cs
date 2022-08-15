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

    public static class ResolveEvent
    {
        [FunctionName("ResolveEvent")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [Table("AlertsEvents", Connection = "AzureWebJobsStorage")] CloudTable alertEventsTable,
            ILogger log)
        {
            var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            string rowKey = requestQuery.Get("eventRowKey");
            AlertEventEntity entity = await AlertUtils.resolveEvent(alertEventsTable, rowKey);
            var jsonToReturn = JsonConvert.SerializeObject(entity);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }
    }
}

