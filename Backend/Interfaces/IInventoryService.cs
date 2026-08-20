using Backend.Dtos;

namespace Backend.Interfaces
{
    public interface IInventoryService
    {
        Task<InventoryDto> CreateInventoryAsync(CreateInventoryDto dto);

        Task<IEnumerable<InventoryDto>> GetInventoryAsync();
    }
}
