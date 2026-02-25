namespace Duja.Models.payments
{
    public class PaymentOptions
    {

        public string ApiKey { get; set; } = "";
        public string BaseUrl { get; set; } = "https://accept.paymob.com/api";
        public int CardIntegrationId { get; set; }
        public int WalletIntegrationId { get; set; }
        public int CardIframeId { get; set; }
    }
}
