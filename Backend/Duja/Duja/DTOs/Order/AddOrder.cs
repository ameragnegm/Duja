namespace Duja.DTOs.Order
{
    public class AddOrder
    {
        public string UserId { get; set; }
        public string Address { get; set; }
        public string PaymentMethod { get; set; }

        public decimal DeliveryPrice { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public string OwnerName { get; set; }
        public string OwnerPhone { get; set; }
        public List<addOrderItem> OrderItems { get; set; }

    }
}
