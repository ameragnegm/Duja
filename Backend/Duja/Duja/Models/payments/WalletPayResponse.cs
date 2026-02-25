using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class WalletPayResponse
    {
        [JsonPropertyName("redirect_url")]
        public string? RedirectUrl { get; set; }
    }
}
