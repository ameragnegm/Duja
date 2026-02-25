using Duja.Models;

namespace Duja.DTOs.Product
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ProductImageDTO> Images { get; set; }
        public decimal Price { get; set; }
        public List<ProductVarientDto> Variants { get; set; }
        public int CategoryId { get; set; }

    }
}
