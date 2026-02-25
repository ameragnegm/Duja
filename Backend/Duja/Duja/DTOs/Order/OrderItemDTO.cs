using Duja.Models;
using System.ComponentModel.DataAnnotations;

namespace Duja.DTOs.Order
{
    public class OrderItemDTO
    {
        public int Id { get; set; }
        public string ProductName { get; set; } 
        public string ProductImage { get; set; }

        public string Size { get; set; }
        public string Color { get; set; } 
        public int Quantity { get; set; } 
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; } 
        
    }
}
