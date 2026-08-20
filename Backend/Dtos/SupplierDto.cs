namespace Backend.Dtos
{
    public class SupplierDto
    {

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

    }

    public class CreateSupplierDto
    {
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
    }

    public class UpdateSupplierDto
    {
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
    }
}
