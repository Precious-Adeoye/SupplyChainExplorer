using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class ProductDto
    {
        public string Name { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string WarehouseName { get; set; } = string.Empty;
    }

    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Sku { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public string SupplierName { get; set; } = string.Empty;

        [Required]
        public string CategoryName { get; set; } = string.Empty;

        [Required]
        public string WarehouseName { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderLevel { get; set; }
    }
    public class UpdateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
