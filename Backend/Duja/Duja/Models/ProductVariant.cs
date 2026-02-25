namespace Duja.Models
{
    public class ProductVariant
    {

        public int Id { get; set; }
        public int ProductId { get; set; }
        public  virtual Product Product { get; set; }
        public int SizeId { get; set; }
        public virtual Size Size { get; set; }

        public int ColorId { get; set; }
        public virtual Color Color { get; set; }

        public decimal Width { get; set; }
        public decimal Length { get; set; }
        public int StockQuantity { get; set; }

    }
}
