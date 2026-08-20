using Backend.Dtos;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync();
        Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto);
        Task<IEnumerable<object>> GetSupplierProductsAsync(
            string supplierName);
    }
}
