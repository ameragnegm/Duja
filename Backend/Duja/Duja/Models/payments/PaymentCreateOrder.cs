namespace Duja.Models.payments
{
    public class PaymentCreateOrder
    {
        public string MerchantOrderId { get; set; } = "";
        public int AmountCents { get; set; }
    }
}
