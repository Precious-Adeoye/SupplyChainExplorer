namespace Backend.Models
{
    public class Product
    {
        public string Name { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public decimal Price { get; set; }
    }
}
