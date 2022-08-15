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
    public class UserEntity : TableEntity
    {
        public string Username { get; set; }
        public string password { get; set; }
    }

    public static class UserFunctions
    {
        [FunctionName("User")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [Table("Users", Connection = "AzureWebJobsStorage")] CloudTable userTable,
            [Table("AutoIncrementId", Connection = "AzureWebJobsStorage")] CloudTable idTable,
            ILogger log)
        {
            var requestQuery = System.Web.HttpUtility.ParseQueryString(req.QueryString.ToString());
            string userId = requestQuery.Get("UserId");
            string password = requestQuery.Get("Password");
            if (req.Method == HttpMethod.Post.ToString())
            {
                return await CreateUser(userTable, idTable, log, userId, password);
            }
            else
            {
                return await GetUser(userTable, log, userId);
            }
        }

        private static async Task<HttpResponseMessage> CreateUser(CloudTable userTable, CloudTable idTable, ILogger log, string userId, string password)
        {
            log.LogInformation($"request params = {userId}  - {password}");
            log.LogInformation($"check this {GetUserEntityByUsername(userTable, userId)}");
            var checkExists = await GetUserEntityByUsername(userTable, userId);
            if (userId == null || password == null || checkExists != null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            log.LogInformation("Got Here");
            var user = new UserEntity()
            {
                Username = userId,
                password = password,
                PartitionKey = "global",
                RowKey = (await IdUtils.GetNewId(idTable, "user", log)).ToString(),
            };
            var result = await userTable.ExecuteAsync(TableOperation.Insert(user));
            var jsonToReturn = JsonConvert.SerializeObject(user);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
            };
        }

        private static async Task<HttpResponseMessage> GetUser(CloudTable userTable, ILogger log, string userId)
        {
            if (userId == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            UserEntity userEntity = await GetUserEntityByUsername(userTable, userId);
            if (userEntity == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            else
            {
                var jsonToReturn = JsonConvert.SerializeObject(userEntity);
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(jsonToReturn, Encoding.UTF8, "application/json")
                };
            }
        }

        private static async Task<UserEntity> GetUserEntityByUsername(CloudTable userTable, string userId)
        {
            TableQuery<UserEntity> dbQuery = new TableQuery<UserEntity>()
                            .Where(TableQuery.GenerateFilterCondition("Username", "eq", userId))
                            .Select(new string[] { "Username", "password" })
                            .Take(1);
            TableQuerySegment<UserEntity> rows = await userTable.ExecuteQuerySegmentedAsync(dbQuery, null);
            return rows.Results.Count > 0 ? rows.Results[0] : null;
        }
    }
}
