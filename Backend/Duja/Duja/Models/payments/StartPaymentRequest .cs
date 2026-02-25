namespace Duja.Models.payments
{
    public enum PaymentMethod
    {
        Card = 1,
        Wallet = 2
    }

    public class StartPaymentRequest
    {
        public string MerchantOrderId { get; set; } = "";
        public int AmountCents { get; set; }

        // For Vodafone Cash (wallet)
        public string? WalletPhone { get; set; }

        // Billing (you can send from checkout)
        public string FirstName { get; set; } = "NA";
        public string LastName { get; set; } = "NA";
        public string Email { get; set; } = "test@test.com";
        public string PhoneNumber { get; set; } = "01000000000";

        public PaymentMethod Method { get; set; } = PaymentMethod.Card;

    }
}
