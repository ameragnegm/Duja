using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymentAuth
    {
        public class PaymobAuthRequest
        {
            [JsonPropertyName("api_key")]
            public string ApiKey { get; set; } = "";
        }

        public class PaymobAuthResponse
        {
            [JsonPropertyName("token")]
            public string Token { get; set; } = "";
        }
    }
}
