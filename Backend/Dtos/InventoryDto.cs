using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class InventoryDto
    {
        public string ProductSku { get; set; } = string.Empty;

        public string WarehouseName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public int ReorderLevel { get; set; }
    }

    public class CreateInventoryDto
    {
        [Required]
        public string ProductSku { get; set; } = string.Empty;

        [Required]
        public string WarehouseName { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderLevel { get; set; }
    }
}
