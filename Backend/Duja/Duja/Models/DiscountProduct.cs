namespace Duja.Models
{
    public class DiscountProduct
    {
        public int Id { get; set; }

        public int DiscountId { get; set; }
        public Discount Discount { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;


    }
}
