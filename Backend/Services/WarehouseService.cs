using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Neo4j.Driver;

namespace Backend.Services
{
    public class WarehouseService : IWarehouseService
    {
        private readonly CognoDbConnection _database;

        public WarehouseService(CognoDbConnection database)
        {
            _database = database;
        }
        public async Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto)
        {
            var query = """
            CREATE (w:Warehouse {
                name: $name,
                location: $location
            })
            RETURN w
            """;

        var session = _database.Driver.AsyncSession();

        try
        {
            var parameters = new
            {
                name = dto.Name,
                location = dto.Location
            };

            var result = await session.RunAsync(query, parameters);

            var record = await result.SingleAsync();

            var warehouse = record["w"].As<INode>();

            return new WarehouseDto
            {
                Name = warehouse.Properties["name"]?.ToString() ?? string.Empty,
                Location = warehouse.Properties["location"]?.ToString() ?? string.Empty
            };
        }
        finally
        {
            await session.CloseAsync();
        }
        }

        public async Task<IEnumerable<WarehouseDto>> GetAllWarehousesAsync()
        {
            var query = """
            MATCH (w:Warehouse)
            RETURN w
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var result = await session.RunAsync(query);

                var records = await result.ToListAsync();

                return records.Select(record =>
                {
                    var warehouse = record["w"].As<INode>();

                    return new WarehouseDto
                    {
                        Name = warehouse.Properties["name"]?.ToString() ?? string.Empty,
                        Location = warehouse.Properties["location"]?.ToString() ?? string.Empty
                    };
                }).ToList();
            }
            finally
            {
                await session.CloseAsync();
            }
        }
    }
}
