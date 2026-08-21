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
                    Name = supplier.Properties.TryGetValue("name", out var name)
          ? name?.ToString() ?? string.Empty
          : string.Empty,

                    Email = supplier.Properties.TryGetValue("email", out var email)
          ? email?.ToString() ?? string.Empty
          : string.Empty,

                    Phone = supplier.Properties.TryGetValue("phone", out var phone)
          ? phone?.ToString() ?? string.Empty
          : string.Empty
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

                return records.Select(record =>
                {
                    var supplier = record["s"].As<INode>();

                    supplier.Properties.TryGetValue("name", out var name);
                    supplier.Properties.TryGetValue("email", out var email);
                    supplier.Properties.TryGetValue("phone", out var phone);

                    return new SupplierDto
                    {
                        Name = name?.ToString() ?? string.Empty,
                        Email = email?.ToString() ?? string.Empty,
                        Phone = phone?.ToString() ?? string.Empty
                    };
                }).ToList();

               
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

        public async Task<SupplierDto> UpdateSupplierAsync(  string name, UpdateSupplierDto dto)
        {
            var query = """
        MATCH (s:Supplier {name: $name})
        SET s.email = $email,
            s.phone = $phone
        RETURN s
        """;

            await using var session =
                _database.Driver.AsyncSession();

            var parameters = new
            {
                name,
                email = dto.Email,
                phone = dto.Phone
            };

            var result =
                await session.RunAsync(query, parameters);

            var record = await result.SingleAsync();

            var supplier =
                record["s"].As<INode>();

            return new SupplierDto
            {
                Name =
                    supplier.Properties["name"]?.ToString()
                    ?? string.Empty,

                Email =
                    supplier.Properties["email"]?.ToString()
                    ?? string.Empty,

                Phone =
                    supplier.Properties["phone"]?.ToString()
                    ?? string.Empty
            };
        }

        public async Task<bool> DeleteSupplierAsync(
    string name)
        {
            var query = """
        MATCH (s:Supplier {name: $name})
        DETACH DELETE s
        RETURN count(s) AS deleted
        """;

            await using var session =
                _database.Driver.AsyncSession();

            var result = await session.RunAsync(
                query,
                new { name }
            );

            var record =
                await result.SingleAsync();

            return record["deleted"].As<int>() > 0;
        }
    }


}
