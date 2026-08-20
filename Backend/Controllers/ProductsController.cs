using Backend.Dtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _productService.GetAllProductsAsync();

            return Ok(products);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(
            CreateProductDto dto)
        {
            var product = await _productService.CreateProductAsync(dto);

            return Ok(product);
        }

        [HttpGet("{sku}")]
        public async Task<ActionResult<ProductDto>> GetProductBySku(string sku)
        {
            var product = await _productService.GetProductBySkuAsync(sku);

            if (product == null)
            {
                return NotFound($"Product with SKU '{sku}' was not found.");
            }

            return Ok(product);
        }

        [HttpPut("{sku}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(
        string sku,
        UpdateProductDto dto)
        {
            var product = await _productService.UpdateProductAsync(sku, dto);

            if (product == null)
            {
                return NotFound($"Product with SKU '{sku}' was not found.");
            }

            return Ok(product);
        }

        [HttpDelete("{sku}")]
        public async Task<IActionResult> DeleteProduct(string sku)
        {
            var deleted = await _productService.DeleteProductAsync(sku);

            if (!deleted)
            {
                return NotFound($"Product with SKU '{sku}' was not found.");
            }

            return NoContent();
        }
    }
}
