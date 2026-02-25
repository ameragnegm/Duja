using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class WalletPayRequest
    {
        [JsonPropertyName("source")]
        public PaymobWalletSource Source { get; set; } = new();

        [JsonPropertyName("payment_token")]
        public string PaymentToken { get; set; } = "";
    }
}
