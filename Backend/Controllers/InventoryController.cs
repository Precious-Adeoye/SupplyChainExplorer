using Backend.Dtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryDto>>> GetInventory()
        {
            var inventory = await _inventoryService.GetInventoryAsync();

            return Ok(inventory);
        }

        [HttpPost]
        public async Task<ActionResult<InventoryDto>> CreateInventory(
            CreateInventoryDto dto)
        {
            var inventory = await _inventoryService.CreateInventoryAsync(dto);

            return Ok(inventory);
        }
    }
}
