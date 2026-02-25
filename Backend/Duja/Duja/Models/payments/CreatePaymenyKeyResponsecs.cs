using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class CreatePaymenyKeyResponsecs
    {
        [JsonPropertyName("token")] public string Token { get; set; } = "";

    }
}
