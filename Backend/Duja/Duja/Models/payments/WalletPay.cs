using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymobWalletPayRequest
    {
        [JsonPropertyName("source")]
        public PaymobWalletSource Source { get; set; } = new();

        [JsonPropertyName("payment_token")]
        public string PaymentToken { get; set; } = "";
    }

    public class PaymobWalletSource
    {
        [JsonPropertyName("identifier")]
        public string Identifier { get; set; } = ""; // Vodafone Cash number

        [JsonPropertyName("subtype")]
        public string Subtype { get; set; } = "WALLET";
    }
    public class PaymobWalletPayData
    {
        [JsonProperty("message")]
        public string? Message { get; set; }
    }
    // Paymob returns JSON that usually includes redirect_url
    public class PaymobWalletPayResponse
    {
        [JsonProperty("data")]
        public PaymobWalletPayData? Data { get; set; }

        // sometimes there is "detail"
        [JsonProperty("detail")]
        public string? Detail { get; set; }
        [JsonProperty("redirect_url")]
        public string? RedirectUrl { get; set; }

        [JsonProperty("iframe_redirection_url")]
        public string? IframeRedirectionUrl { get; set; }

        [JsonProperty("redirection_url")]
        public string? RedirectionUrl { get; set; }

        [JsonProperty("success")]
        public bool? Success { get; set; }

        [JsonProperty("message")]
        public string? Message { get; set; }
    }

}
