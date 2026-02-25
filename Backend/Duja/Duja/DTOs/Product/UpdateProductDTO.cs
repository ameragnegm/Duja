namespace Duja.DTOs.Product
{
    public class UpdateProductDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<IFormFile>? NewImages { get; set; } = new List<IFormFile>();

        public List<int>? ImagesToDelete { get; set; } = new List<int>();
        public decimal Price { get; set; }
        public List<AddvarientDTO> Variants { get; set; } = new List<AddvarientDTO>();
        public int CategoryId { get; set; }

    }
}
