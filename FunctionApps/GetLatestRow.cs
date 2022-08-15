using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace FunctionApps
{

    public static class GetJson
    {
        [FunctionName("GetLatestRow")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [Table("RawDeviceData", Connection = "AzureWebJobsStorage")] CloudTable rawDataTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idsData,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            try
            {
                var row = await RawDataUtils.GetNewestRow(rawDataTable, log);
                return new OkObjectResult(JsonSerializer.Serialize(row));
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}
