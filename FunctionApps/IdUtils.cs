using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace FunctionApps
{
    public class IdEntry : TableEntity
    {
        public int value { get; set; }

    }

    internal class IdUtils
    {
        private const string PARTITION = "global";
        public const string DEFAULT_ROWKEY = "global";
        public static async Task<int> GetNewId(
            CloudTable idTable,
            string rowKey,
            ILogger log)
        {
            log.LogInformation("Getting DB Entries");
            TableOperation retrieveRow = TableOperation.Retrieve<IdEntry>(PARTITION, rowKey);

            var queryResult = await idTable.ExecuteAsync(retrieveRow);
            IdEntry idEntry = (IdEntry)queryResult.Result;
            idEntry.value++;
            log.LogInformation("Inserting new row, id: " + JsonConvert.SerializeObject(idEntry));
            var replaceIdOp = TableOperation.Replace(idEntry);
            await idTable.ExecuteAsync(replaceIdOp);
            return idEntry.value;
        }

        [Serializable]
        public class QueryError : Exception
        {
            public QueryError() : base() { }
            public QueryError(string message) : base(message) { }
            public QueryError(string message, Exception inner) : base(message, inner) { }

            // A constructor is needed for serialization when an
            // exception propagates from a remoting server to the client.
            protected QueryError(System.Runtime.Serialization.SerializationInfo info,
                System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
        }

        //public static async Task<int> InsertRawDataEntry(CloudTable table, int value, EventData eventData, ILogger log)
        //{
        //    RawDataEntry counter = new RawDataEntry();
        //    counter.PartitionKey = "0";
        //    counter.RowKey = counter.Timestamp.ToString("o");
        //    counter.Counter = value;
        //    counter.RawData = Encoding.Default.GetString(eventData.Body);
        //    log.LogInformation("event propertis are:");
        //    log.LogInformation("\t" + "Body:" + "\t" + Encoding.Default.GetString(eventData.Body));
        //    foreach (KeyValuePair<string, object> kvp in eventData.Properties)
        //    {
        //        log.LogInformation("\t Property: " + string.Format("Key = {0}, Value = {1}", kvp.Key, kvp.Value));
        //    }
        //    log.LogInformation("Inserting new row, id: " + JsonConvert.SerializeObject(counter));
        //    var operation = TableOperation.Insert(counter);
        //    await table.ExecuteAsync(operation);
        //    return value;
        //}
    }
}
