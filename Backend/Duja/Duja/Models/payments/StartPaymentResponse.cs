namespace Duja.Models.payments
{
    public class StartPaymentResponse
    {
        public string CheckoutUrl { get; set; } = "";
        public long PaymobOrderId { get; set; }
        public PaymentMethod Method { get; set; }
    }
}
