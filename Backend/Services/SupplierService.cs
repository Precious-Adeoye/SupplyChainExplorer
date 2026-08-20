using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Neo4j.Driver;

namespace Backend.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly CognoDbConnection _database;

        public SupplierService(CognoDbConnection database)
        {
            _database = database;
        }

        public async Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto)
        {
           var query = """
            CREATE (s:Supplier {
                name: $name,
                email: $email,
                phone: $phone
            })
            RETURN s
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    name = dto.Name,
                    email = dto.Email,
                    phone = dto.Phone
                };

                var result = await session.RunAsync(query, parameters);

                var record = await result.SingleAsync();

                var supplier = record["s"].As<INode>();

                return new SupplierDto
                {
                    Name = supplier.Properties["name"]?.ToString() ?? string.Empty,
                    Email = supplier.Properties["email"]?.ToString() ?? string.Empty,
                    Phone = supplier.Properties["phone"]?.ToString() ?? string.Empty
                };
            }
            finally
            {
                await session.CloseAsync();
            }

        }

        public async Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync()
        {
           var query = """
            MATCH (s:Supplier)
            RETURN s
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var result = await session.RunAsync(query);

                var records = await result.ToListAsync();

                var suppliers = records.Select(record =>
                {
                    var supplier = record["s"].As<INode>();

                    return new SupplierDto
                    {
                        Name = supplier.Properties["name"]?.ToString() ?? string.Empty,
                        Email = supplier.Properties["email"]?.ToString() ?? string.Empty,
                        Phone = supplier.Properties["phone"]?.ToString() ?? string.Empty
                    };
                }).ToList();

                return suppliers;
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public Task<IEnumerable<object>> GetSupplierProductsAsync(string supplierName)
        {
            throw new NotImplementedException();
        }
    }
}
