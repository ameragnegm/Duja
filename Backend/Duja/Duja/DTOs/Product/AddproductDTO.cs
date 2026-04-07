using Duja.Models;

namespace Duja.DTOs.Product
{
    public class AddproductDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<IFormFile> NewImages { get; set; }
        public decimal Price { get; set; }
        public String? VariantsINJSON { get; set; } 
        public int CategoryId { get; set; }

    }
}
