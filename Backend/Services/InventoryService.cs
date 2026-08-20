using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Neo4j.Driver;

namespace Backend.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly CognoDbConnection _database;

        public InventoryService(CognoDbConnection database)
        {
            _database = database;
        }
        public async Task<InventoryDto> CreateInventoryAsync(CreateInventoryDto dto)
        {
            var query = """
            MATCH (p:Product {sku: $productSku})
            MATCH (w:Warehouse {name: $warehouseName})

            CREATE (p)-[:STORED_AT {
                quantity: $quantity,
                reorderLevel: $reorderLevel
            }]->(w)

            RETURN p.sku AS productSku,
                   w.name AS warehouseName,
                   $quantity AS quantity,
                   $reorderLevel AS reorderLevel
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    productSku = dto.ProductSku,
                    warehouseName = dto.WarehouseName,
                    quantity = dto.Quantity,
                    reorderLevel = dto.ReorderLevel
                };

                var result = await session.RunAsync(query, parameters);

                var record = await result.SingleAsync();

                return new InventoryDto
                {
                    ProductSku = record["productSku"].As<string>(),
                    WarehouseName = record["warehouseName"].As<string>(),
                    Quantity = record["quantity"].As<int?>() ?? 0,
                    ReorderLevel = record["reorderLevel"].As<int?>() ?? 0
                };
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<IEnumerable<InventoryDto>> GetInventoryAsync()
        {
            var query = """
            MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
            RETURN p.sku AS productSku,
                   w.name AS warehouseName,
                   r.quantity AS quantity,
                   r.reorderLevel AS reorderLevel
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var result = await session.RunAsync(query);

                var records = await result.ToListAsync();

                return records.Select(record => new InventoryDto
                {
                    ProductSku = record["productSku"].As<string>(),
                    WarehouseName = record["warehouseName"].As<string>(),
                    Quantity = record["quantity"].As<int>(),
                    ReorderLevel = record["reorderLevel"].As<int>()
                }).ToList();
            }
            finally
            {
                await session.CloseAsync();
            }
        }
    }
    
}
