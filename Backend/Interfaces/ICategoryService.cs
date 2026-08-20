using Backend.Dtos;

namespace Backend.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();

        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    }
}
