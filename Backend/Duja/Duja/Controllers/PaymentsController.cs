using Duja.Interfaces;
using Duja.Models.payments;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentClient _paymob;
        private readonly PaymentOptions _paymentOptions;

        public PaymentsController(IPaymentClient paymob , IOptions<PaymentOptions> opts)
        {
            _paymob = paymob;
            _paymentOptions = opts.Value;

        }

        [HttpGet("test-auth")]
        public async Task<IActionResult> TestAuth(CancellationToken ct)
        {
            var token = await _paymob.GetAuthTokenAsync(ct);
            return Ok(new { token });
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] PaymentCreateOrder req, CancellationToken ct)
        {
            var items = new List<PaymobOrderItem>
                {
                new PaymobOrderItem
                {
                    Name = "Test Item",
                    AmountCents = req.AmountCents,
                    Description = "Test order",
                    Quantity = 1
                }
            };

            var paymobOrderId = await _paymob.CreateOrderAsync(req.MerchantOrderId, req.AmountCents, items, ct);

            return Ok(new { paymobOrderId });
        }

        [HttpPost("startPayment")]
        public async Task<IActionResult> StartPayment([FromBody] StartPaymentRequest req, CancellationToken ct)
        {
            // 1) Validation
            if (req.AmountCents <= 0)
                return BadRequest("amountCents must be greater than zero.");

            if (string.IsNullOrWhiteSpace(req.MerchantOrderId))
                return BadRequest("merchantOrderId is required.");

            // 2) Create Paymob order
            var items = new List<PaymobOrderItem>
    {
        new PaymobOrderItem
        {
            Name = "Order",
            Quantity = 1,
            AmountCents = req.AmountCents,
            Description = req.MerchantOrderId
        }
    };

            long paymobOrderId = await _paymob.CreateOrderAsync(
                req.MerchantOrderId,
                req.AmountCents,
                items,
                ct
            );

            // 3) Build billing info
            var billing = new PaymentData
            {
                FirstName = req.FirstName,
                LastName = req.LastName,
                Email = req.Email,
                PhoneNumber = req.PhoneNumber
            };


            // -------------------------------------
            // 🚀 4) HANDLE WALLET (method = 2)
            // -------------------------------------
            if (req.Method == PaymentMethod.Wallet)
            {
                if (string.IsNullOrWhiteSpace(req.WalletPhone))
                    return BadRequest("walletPhone is required for wallet payments.");

                // 👉 THIS IS WHERE YOU ADD IT
                var walletPaymentKey = await _paymob.CreatePaymentKeyAsync(
                    paymobOrderId,
                    req.AmountCents,
                    _paymentOptions.WalletIntegrationId,   // 5475905
                    billing,
                    ct
                );

                // 5) Pay with Wallet
                var redirectUrl = await _paymob.PayWithWalletAsync(walletPaymentKey, req.WalletPhone, ct);

                return Ok(new StartPaymentResponse
                {
                    CheckoutUrl = redirectUrl,
                    PaymobOrderId = paymobOrderId,
                    Method = PaymentMethod.Wallet
                });
            }


            // -------------------------------------
            // 🚀 5) HANDLE CARD (method = 1)
            // -------------------------------------
            if (req.Method == PaymentMethod.Card)
            {
                var cardPaymentKey = await _paymob.CreatePaymentKeyAsync(
                    paymobOrderId,
                    req.AmountCents,
                    _paymentOptions.CardIntegrationId,
                    billing,
                    ct
                );

                string url = $"https://accept.paymob.com/api/acceptance/iframes/{_paymentOptions.CardIframeId}?payment_token={cardPaymentKey}";

                return Ok(new StartPaymentResponse
                {
                    CheckoutUrl = url,
                    PaymobOrderId = paymobOrderId,
                    Method = PaymentMethod.Card
                });
            }

            return BadRequest("Invalid payment method.");
        }

    }
}
