using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymobOrderItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("amount_cents")]
        public int AmountCents { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; } = "";

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; } = 1;
    }
}
