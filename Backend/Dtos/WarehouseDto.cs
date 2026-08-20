namespace Backend.Dtos
{
    public class WarehouseDto
    {
        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

    }

    public class CreateWarehouseDto
    {
        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;
        
    }
}
