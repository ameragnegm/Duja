using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

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
        public decimal? Length { get; set; }

        public decimal? Shoulder { get; set; }
        public decimal? bust { get; set; }
        public decimal? Sleevelength { get; set; }

        public decimal? Waist { get; set; }

        public decimal? Hip { get; set; }

        public decimal? Inseam { get; set; }

        public decimal? Thigh { get; set; }
        
        public decimal? Weight { get; set; }

        public String? Note { get; set; }
        public int StockQuantity { get; set; }

    }
}
