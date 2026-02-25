using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Duja.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        [ForeignKey("OrderId"),Required]
        public virtual Order Order { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public int Quantity { get; set; }
        public int ProductVariantId { get; set; }

        [ForeignKey("ProductVariantId"),Required]
        public virtual ProductVariant ProductVariant { get; set; }


    }
}
