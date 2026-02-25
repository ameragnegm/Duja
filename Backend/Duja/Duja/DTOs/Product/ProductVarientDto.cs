namespace Duja.DTOs.Product
{
    public class ProductVarientDto
    { 
        public int Id { get; set; }
        public int SizeID { get; set; }
        public int ColorID { get; set; }
        public decimal Width { get; set; }
        public decimal Length { get; set; }
        public int StockQuantity { get; set; }

    }
}
