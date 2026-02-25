import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../services/cart-service';
import { OrderService } from '../../../services/order-service';
import { IAddOrder } from '../../../models/Order/AddOrder.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderForm implements OnInit {
  deliveryFee = 50;
  form: FormGroup;
  cartItems: any[] = [];
  totalAmount: number = 0;
  isSubmitting: boolean = false;

  // Toggle for "Gift" mode
  isGift: boolean = false;

  // Mock User Data (In a real app, get this from AuthService)
  currentUser = {
    name: 'Islam (You)',
    phone: '01000000000'
  };

  private apiUrl = 'http://localhost:5067/api/orders';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // "recipientName" maps to backend "userName"
      recipientName: ['', Validators.required],
      recipientPhone: ['', [Validators.required, Validators.pattern('^01[0-2,5]{1}[0-9]{8}$')]],
      address: ['', Validators.required],
      paymentOption: ['Full', Validators.required],
      notes: [''] // Extra info
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();

    this.fillMyInfo();
  }

  onGiftToggle(event: any) {
    this.isGift = event.target.checked;
    if (!this.isGift) {
      this.fillMyInfo();
    } else {
      this.form.patchValue({
        recipientName: '',
        recipientPhone: ''
      });
    }
  }

  fillMyInfo() {
    this.form.patchValue({
      recipientName: this.currentUser.name,
      recipientPhone: this.currentUser.phone
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );
  }

  placeOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const orderItemsPayload = this.cartItems.map(item => ({
      productVariantId: item.variant.id,
      quantity: item.quantity
    }));

    // APPEND PHONE AND NOTES TO ADDRESS
    // Since your backend only has 'address', we combine the extra info there
    const fullAddress = `
      ${this.form.value.address} 
      | Phone: ${this.form.value.recipientPhone} 
      | Note: ${this.form.value.notes || 'None'}
    `.trim();

    const orderPayload = {
      userName: this.form.value.recipientName, // Send Recipient Name
      address: fullAddress,                    // Send Combined Address + Phone
      paymentMethod: this.form.value.paymentMethod,
      orderItems: orderItemsPayload
    };

    // this.http.post(this.apiUrl, orderPayload).subscribe({
    //   next: (res) => {
    //     this.cartService.clearCart();
    //     this.router.navigate(['/orders']);
    //   },
    //   error: (err) => {
    //     this.isSubmitting = false;
    //     alert('Error placing order');
    //   }
    // });
  }
}
