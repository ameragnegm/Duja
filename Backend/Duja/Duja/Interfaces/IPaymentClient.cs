using Duja.Models.payments;

namespace Duja.Interfaces
{
    public interface IPaymentClient
    {
        Task<string> GetAuthTokenAsync(CancellationToken ct = default);
        Task<long> CreateOrderAsync(string merchantOrderId, int amountCents, List<PaymobOrderItem> items, CancellationToken ct = default);
        Task<string> CreatePaymentKeyAsync(long paymobOrderId, int amountCents, int integrationId, PaymentData billing, CancellationToken ct = default);
        Task<string> PayWithWalletAsync(string paymentToken, string walletPhone, CancellationToken ct = default);

    }
}
