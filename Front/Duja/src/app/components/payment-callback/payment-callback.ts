import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center d-flex flex-column justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="spinner-border text-primary mb-4" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h3 class="fw-bold">Processing your payment...</h3>
      <p class="text-muted">Please do not close or refresh this window.</p>
    </div>
  `
})
export class PaymentCallback implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Read the query parameters attached by Paymob
    this.route.queryParams.subscribe(params => {
      
      const isSuccess = params['success']; // Paymob returns this as a string: 'true' or 'false'
      const merchantOrderId = params['merchant_order_id']; // This is your Database Order ID

      if (isSuccess === 'true') {
        // ✅ PAYMENT SUCCESSFUL
        // Redirect them to the orders page to see their new purchase
        this.router.navigate(['/manage/orders']);
      } 
      else if (isSuccess === 'false') {
        // ❌ PAYMENT FAILED / DECLINED
        
        if (merchantOrderId) {
          // Send a DELETE request to your C# backend to remove the orphaned order
          this.orderService.DeleteOrder(Number(merchantOrderId)).subscribe({
            next: () => {
              alert('Payment was declined or cancelled. The order has been removed.');
              // Redirect back to the website/checkout
              this.router.navigate(['/checkout']); 
            },
            error: (err) => {
              console.error('Failed to delete orphaned order', err);
              alert('Payment declined. Please try your order again.');
              this.router.navigate(['/checkout']);
            }
          });
        } else {
          // Fallback if Paymob didn't return an Order ID
          this.router.navigate(['/checkout']);
        }
      }
    });
  }
}