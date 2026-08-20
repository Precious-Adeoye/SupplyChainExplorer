using Backend.Dtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;

        public WarehousesController(IWarehouseService warehouseService)
        {
            _warehouseService = warehouseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WarehouseDto>>> GetWarehouses()
        {
            var warehouses = await _warehouseService.GetAllWarehousesAsync();

            return Ok(warehouses);
        }

        [HttpPost]
        public async Task<ActionResult<WarehouseDto>> CreateWarehouse(
            CreateWarehouseDto dto)
        {
            var warehouse = await _warehouseService.CreateWarehouseAsync(dto);

            return Ok(warehouse);
        }

        [HttpPut("{name}")]
        public async Task<ActionResult<WarehouseDto>> UpdateWarehouse(string name,UpdateWarehouseDto dto)
        {
            var warehouse =
                await _warehouseService.UpdateWarehouseAsync(
                    name,
                    dto
                );

            return Ok(warehouse);
        }


        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteWarehouse(
            string name)
        {
            var deleted =
                await _warehouseService.DeleteWarehouseAsync(
                    name
                );

            if (!deleted)
            {
                return NotFound(
                    $"Warehouse '{name}' was not found."
                );
            }

            return NoContent();
        }
    }
}
