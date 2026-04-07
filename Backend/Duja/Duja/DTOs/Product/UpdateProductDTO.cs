namespace Duja.DTOs.Product
{
    public class UpdateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }

        public List<IFormFile>? NewImages { get; set; }
        public List<int>? ImagesToDelete { get; set; }

        // flexible: one object or array
        public string? VariantsINJSON { get; set; }
    }
}