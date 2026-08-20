namespace Backend.Dtos
{
    public class CategoryDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
