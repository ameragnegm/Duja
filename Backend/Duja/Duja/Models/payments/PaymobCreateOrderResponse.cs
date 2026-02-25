using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymobCreateOrderResponse
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
    }
}
