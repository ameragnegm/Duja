using System.ComponentModel.DataAnnotations.Schema;

namespace Duja.Models
{
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Shipped,
        Delivered,
        Canceled
    }
    public enum PaymentMethod
    {
        FullAmount,
        DeliveryOnly
    }
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string Address { get; set; }
        public PaymentMethod PaymentMethod { get; set; }   
        public string OwnerName { get; set; }
        public string OwnerPhone { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal Delivery { get; set; }
        public decimal RemainingAmount { get; set; }

        public string UserId { get; set; }  
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
