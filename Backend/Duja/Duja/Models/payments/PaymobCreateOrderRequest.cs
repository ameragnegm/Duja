using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymobCreateOrderRequest
    {
        [JsonPropertyName("auth_token")]
        public string AuthToken { get; set; } = "";

        [JsonPropertyName("delivery_needed")]
        public string DeliveryNeeded { get; set; } = "false";

        [JsonPropertyName("amount_cents")]
        public int AmountCents { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; } = "EGP";

        [JsonPropertyName("merchant_order_id")]
        public string MerchantOrderId { get; set; } = "";

        [JsonPropertyName("items")]
        public List<PaymobOrderItem> Items { get; set; } = new();
    }
}
