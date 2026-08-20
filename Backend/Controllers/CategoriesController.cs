using Backend.Dtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            return Ok(categories);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(
            CreateCategoryDto dto)
        {
            var category = await _categoryService.CreateCategoryAsync(dto);

            return Ok(category);
        }
    }
}
