using Backend.Dtos;

namespace Backend.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();

        Task<ProductDto> CreateProductAsync(CreateProductDto dto);
        Task<ProductDto?> GetProductBySkuAsync(string sku);
        Task<ProductDto?> UpdateProductAsync(string sku, UpdateProductDto dto);
        Task<bool> DeleteProductAsync(string sku);
    }
}
