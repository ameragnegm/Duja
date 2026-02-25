using Duja.Models;
using System.ComponentModel.DataAnnotations;


namespace Duja.DTOs.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string userName { get; set; }
        public string Status { get; set; } 

        public string OwnerName { get; set; }
        public string OwnerPhone { get; set; }
        public string Address { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public decimal Delivery { get; set; }

        public string PaymentMethod { get; set; }

        public ICollection<OrderItemDTO> OrderItems { get; set; }
    }
}
