using System.Text.Json.Serialization;

namespace Duja.Models.payments
{
    public class PaymentData
    {
        [JsonPropertyName("apartment")] public string Apartment { get; set; } = "NA";
        [JsonPropertyName("email")] public string Email { get; set; } = "test@test.com";
        [JsonPropertyName("floor")] public string Floor { get; set; } = "NA";
        [JsonPropertyName("first_name")] public string FirstName { get; set; } = "NA";
        [JsonPropertyName("street")] public string Street { get; set; } = "NA";
        [JsonPropertyName("building")] public string Building { get; set; } = "NA";
        [JsonPropertyName("phone_number")] public string PhoneNumber { get; set; } = "01000000000";
        [JsonPropertyName("shipping_method")] public string ShippingMethod { get; set; } = "NA";
        [JsonPropertyName("postal_code")] public string PostalCode { get; set; } = "NA";
        [JsonPropertyName("city")] public string City { get; set; } = "Cairo";
        [JsonPropertyName("country")] public string Country { get; set; } = "EG";
        [JsonPropertyName("last_name")] public string LastName { get; set; } = "NA";
        [JsonPropertyName("state")] public string State { get; set; } = "Cairo";

    }
}
