using Duja.Interfaces;
using Duja.Models.payments;
using System.Text;
using System.Text.Json;
using static Duja.Models.payments.PaymentAuth;
using Duja.Models.payments; // for PaymobCreateOrderRequest and PaymobCreatePaymentKeyRequest

namespace Duja.Service
{
    public class PaymobService : IPaymentClient
    {
        private readonly IHttpClientFactory _factory;
        private readonly PaymentOptions _options;

        public PaymobService(IHttpClientFactory factory, Microsoft.Extensions.Options.IOptions<PaymentOptions> options)
        {
            _factory = factory;
            _options = options.Value;
        }
        public async Task<string> GetAuthTokenAsync(CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(_options.ApiKey))
                throw new InvalidOperationException("Paymob ApiKey is missing.");

            var client = _factory.CreateClient("Paymob");

            var json = System.Text.Json.JsonSerializer.Serialize(
                new PaymobAuthRequest { ApiKey = _options.ApiKey }
            );

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("auth/tokens", content, ct);

            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Paymob auth failed: {(int)response.StatusCode} - {body}");

            var dto = System.Text.Json.JsonSerializer.Deserialize<PaymobAuthResponse>(body);

            if (dto == null || string.IsNullOrWhiteSpace(dto.Token))
                throw new Exception("Paymob returned no token.");

            return dto.Token;
        }


        public async Task<long> CreateOrderAsync(string merchantOrderId, int amountCents, List<PaymobOrderItem> items, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(merchantOrderId))
                throw new ArgumentException("merchantOrderId is required.");

            if (amountCents <= 0)
                throw new ArgumentException("amountCents must be > 0.");

            var authToken = await GetAuthTokenAsync(ct);

            var client = _factory.CreateClient("Paymob");

            var payload = new PaymobCreateOrderRequest
            {
                AuthToken = authToken,
                AmountCents = amountCents,
                Currency = "EGP",
                MerchantOrderId = merchantOrderId,
                DeliveryNeeded = "false",
                Items = items ?? new List<PaymobOrderItem>()
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("ecommerce/orders", content, ct);
            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Paymob create order failed: {(int)response.StatusCode} - {body}");

            var dto = JsonSerializer.Deserialize<PaymobCreateOrderResponse>(body);

            if (dto == null || dto.Id <= 0)
                throw new Exception("Paymob order response missing id.");

            return dto.Id;
        }
        public async Task<string> CreatePaymentKeyAsync(long paymobOrderId, int amountCents, int integrationId, PaymentData billing, CancellationToken ct = default)
        {
            if (paymobOrderId <= 0) throw new ArgumentException("paymobOrderId must be > 0");
            if (amountCents <= 0) throw new ArgumentException("amountCents must be > 0");
            if (integrationId <= 0) throw new ArgumentException("integrationId must be > 0");

            var authToken = await GetAuthTokenAsync(ct);
            var client = _factory.CreateClient("Paymob");

            var payload = new CreatePaymenyKeyRequest
            {
                AuthToken = authToken,
                AmountCents = amountCents,
                OrderId = paymobOrderId,
                IntegrationId = integrationId,
                BillingData = billing ?? new PaymentData(),
                Currency = "EGP",
                Expiration = 3600
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("acceptance/payment_keys", content, ct);
            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Paymob payment key failed: {(int)response.StatusCode} - {body}");

            var dto = JsonSerializer.Deserialize<CreatePaymenyKeyResponsecs>(body);
            if (dto == null || string.IsNullOrWhiteSpace(dto.Token))
                throw new Exception("Paymob payment key response missing token.");

            return dto.Token;
        }

        public async Task<string> PayWithWalletAsync(string paymentToken, string walletPhone, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(paymentToken))
                throw new ArgumentException("paymentToken is required.");

            if (string.IsNullOrWhiteSpace(walletPhone))
                throw new ArgumentException("walletPhone is required.");

            var client = _factory.CreateClient("Paymob");

            if (client.BaseAddress == null)
                throw new Exception("Paymob HttpClient BaseAddress is NULL.");
        //    client.DefaultRequestHeaders.Authorization =
        //new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", paymentToken);
            var payload = new PaymobWalletPayRequest
            {
                PaymentToken = paymentToken,
                Source = new PaymobWalletSource
                {
                    Identifier = walletPhone,
                    Subtype = "WALLET"
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("acceptance/payments/pay", content, ct);
            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Paymob wallet pay http failed: {(int)response.StatusCode} - {body}");

            var dto = Newtonsoft.Json.JsonConvert.DeserializeObject<PaymobWalletPayResponse>(body);

            // pick url from ANY possible field
            var url =
                dto?.RedirectUrl ??
                dto?.IframeRedirectionUrl ??
                dto?.RedirectionUrl;

            // extract best possible message
            var msg =
                dto?.Message ??
                dto?.Data?.Message ??
                dto?.Detail;

            // IMPORTANT:
            // Some wallet flows return success=false but still give a redirection URL.
            // If url exists -> return it (Paymob page will show the error or continue)
            if (!string.IsNullOrWhiteSpace(url))
                return url;

            // No url -> throw the actual Paymob message + raw
            throw new Exception($"Wallet payment failed: {msg ?? "Unknown"} | Raw: {body}");
        }
    }
}
