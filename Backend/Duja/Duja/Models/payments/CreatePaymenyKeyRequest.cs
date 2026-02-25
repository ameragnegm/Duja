using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class CreatePaymenyKeyRequest
    {
        [JsonPropertyName("auth_token")] public string AuthToken { get; set; } = "";
        [JsonPropertyName("amount_cents")] public int AmountCents { get; set; }
        [JsonPropertyName("expiration")] public int Expiration { get; set; } = 3600;
        [JsonPropertyName("order_id")] public long OrderId { get; set; }
        [JsonPropertyName("billing_data")] public PaymentData BillingData { get; set; } = new();
        [JsonPropertyName("currency")] public string Currency { get; set; } = "EGP";
        [JsonPropertyName("integration_id")] public int IntegrationId { get; set; }

    }
}
