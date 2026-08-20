using Backend.Dtos;

namespace Backend.Interfaces
{
    public interface IWarehouseService
    {
        Task<IEnumerable<WarehouseDto>> GetAllWarehousesAsync();

        Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto);
    }
}
