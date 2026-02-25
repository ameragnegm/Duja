using System.ComponentModel.DataAnnotations.Schema;

namespace Duja.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; } 
        public List<productImage> Images { get; set; } = new List<productImage>();
        public decimal Price { get; set; }

        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
        
        public List<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
}
