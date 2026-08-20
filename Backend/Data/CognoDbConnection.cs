using Neo4j.Driver;

namespace Backend.Data
{
    public class CognoDbConnection
    {
        private readonly IDriver _driver;

        public CognoDbConnection(IConfiguration configuration)
        {
            var uri = configuration["COGNODB_URI"];
            var username = configuration["COGNODB_USERNAME"];
            var password = configuration["COGNODB_PASSWORD"];

            _driver = Neo4j.Driver.GraphDatabase.Driver(
                uri,
                AuthTokens.Basic(username, password)
            );
        }

        public IDriver Driver => _driver;
    }
}
