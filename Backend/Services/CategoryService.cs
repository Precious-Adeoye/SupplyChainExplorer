using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Neo4j.Driver;

namespace Backend.Services
{
    public class CategoryService : ICategoryService
    {

        private readonly CognoDbConnection _database;

        public CategoryService(CognoDbConnection database)
        {
            _database = database;
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
        {

            var query = """
            CREATE (c:Category {
                name: $name,
                description: $description
            })
            RETURN c
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var parameters = new
                {
                    name = dto.Name,
                    description = dto.Description
                };

                var result = await session.RunAsync(query, parameters);

                var record = await result.SingleAsync();

                var category = record["c"].As<INode>();

                return new CategoryDto
                {
                    Name = category.Properties["name"]?.ToString() ?? string.Empty,
                    Description = category.Properties["description"]?.ToString() ?? string.Empty
                };
            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var query = """
            MATCH (c:Category)
            RETURN c
            """;

            var session = _database.Driver.AsyncSession();

            try
            {
                var result = await session.RunAsync(query);

                var records = await result.ToListAsync();

                var categories = records.Select(record =>
                {
                    var category = record["c"].As<INode>();

                    return new CategoryDto
                    {
                        Name = category.Properties["name"]?.ToString() ?? string.Empty,
                        Description = category.Properties["description"]?.ToString() ?? string.Empty
                    };
                }).ToList();

                return categories;
            }
            finally
            {
                await session.CloseAsync();
            }
        }
    }
}
