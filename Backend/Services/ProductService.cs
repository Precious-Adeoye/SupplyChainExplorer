using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Neo4j.Driver;

namespace Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly CognoDbConnection _database;

    public ProductService(CognoDbConnection database)
    {
        _database = database;
    }
        public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
        {
           var query = """
            MERGE (s:Supplier {name: $supplierName})
            MERGE (c:Category {name: $categoryName})
            MERGE (w:Warehouse {name: $warehouseName})

            CREATE (p:Product {
                name: $name,
                sku: $sku,
                price: $price,
                categoryName: $categoryName,
                warehouseName: $warehouseName
            })

            CREATE (s)-[:SUPPLIES]->(p)
            CREATE (p)-[:BELONGS_TO]->(c)
            CREATE (p)-[:STORED_AT {
                quantity: $quantity,
                reorderLevel: $reorderLevel
            }]->(w)

            RETURN p
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    supplierName = dto.SupplierName,
                    categoryName = dto.CategoryName,
                    warehouseName = dto.WarehouseName,
                    name = dto.Name,
                    sku = dto.Sku,
                    price = dto.Price,
                    quantity = dto.Quantity,
                    reorderLevel = dto.ReorderLevel
                };

                var result = await session.RunAsync(query, parameters);

                var record = await result.SingleAsync();

                var product = record["p"].As<INode>();

                return new ProductDto
                {
                    Name = product.Properties["name"]?.ToString() ?? string.Empty,
                    Sku = product.Properties["sku"]?.ToString() ?? string.Empty,
                    Price = Convert.ToDecimal(product.Properties["price"]),
                    CategoryName = product.Properties["categoryName"]?.ToString() ?? string.Empty,
                    WarehouseName = product.Properties["warehouseName"]?.ToString() ?? string.Empty
                };
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var query = """
            MATCH (p:Product)
            RETURN p
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var result = await session.RunAsync(query);

                var records = await result.ToListAsync();

                var products = records.Select(record =>
                {
                    var product = record["p"].As<INode>();

                    return new ProductDto
                    {
                        Name = product.Properties["name"]?.ToString() ?? string.Empty,
                        Sku = product.Properties["sku"]?.ToString() ?? string.Empty,
                        Price = Convert.ToDecimal(product.Properties["price"]),
                        //CategoryName = product.Properties["categoryName"]?.ToString() ?? string.Empty,
                        //WarehouseName = product.Properties["warehouseName"]?.ToString() ?? string.Empty
                    };
                }).ToList();

                return products;
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<ProductDto?> GetProductBySkuAsync(string sku)
        {
            var query = """
        MATCH (p:Product {sku: $sku})
        RETURN p
        """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    sku
                };

                var result = await session.RunAsync(query, parameters);

                var records = await result.ToListAsync();

                if (records.Count == 0)
                {
                    return null;
                }

                var product = records[0]["p"].As<INode>();

                return new ProductDto
                {
                    Name = product.Properties["name"]?.ToString() ?? string.Empty,
                    Sku = product.Properties["sku"]?.ToString() ?? string.Empty,
                    Price = Convert.ToDecimal(product.Properties["price"]),
                    
                };
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<ProductDto?> UpdateProductAsync(
    string sku,
    UpdateProductDto dto)
        {
            var query = """
        MATCH (p:Product {sku: $sku})
        SET p.name = $name,
            p.price = $price
        RETURN p
        """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    sku,
                    name = dto.Name,
                    price = dto.Price
                };

                var result = await session.RunAsync(query, parameters);

                var records = await result.ToListAsync();

                if (records.Count == 0)
                {
                    return null;
                }

                var product = records[0]["p"].As<INode>();

                return new ProductDto
                {
                    Name = product.Properties["name"]?.ToString() ?? string.Empty,
                    Sku = product.Properties["sku"]?.ToString() ?? string.Empty,
                    Price = Convert.ToDecimal(product.Properties["price"])
                };
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<bool> DeleteProductAsync(string sku)
        {
            var query = """
        MATCH (p:Product {sku: $sku})
        DETACH DELETE p
        RETURN count(p) AS deleted
        """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    sku
                };

                var result = await session.RunAsync(query, parameters);

                var record = await result.SingleAsync();

                return record["deleted"].As<int>() > 0;
            }
            finally
            {
                await session.CloseAsync();
            }
        }
    }
}
