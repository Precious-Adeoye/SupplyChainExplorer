using Backend.Dtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SuppliersController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDto>>> GetSuppliers()
        {
            var suppliers = await _supplierService.GetAllSuppliersAsync();

            return Ok(suppliers);
        }

        [HttpPost]
        public async Task<ActionResult<SupplierDto>> CreateSupplier( CreateSupplierDto dto)
        {
            var supplier = await _supplierService.CreateSupplierAsync(dto);

            return CreatedAtAction(
                nameof(GetSuppliers),
                supplier
            );
        }

        [HttpPut("{name}")]
        public async Task<ActionResult<SupplierDto>> UpdateSupplier(
    string name,
    UpdateSupplierDto dto)
        {
            var supplier =
                await _supplierService.UpdateSupplierAsync(
                    name,
                    dto
                );

            return Ok(supplier);
        }


        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteSupplier(
            string name)
        {
            var deleted =
                await _supplierService.DeleteSupplierAsync(
                    name
                );

            if (!deleted)
            {
                return NotFound(
                    $"Supplier '{name}' was not found."
                );
            }

            return NoContent();
        }
    }
}
