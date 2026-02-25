import { PayService } from './../../services/pay-service';
import { Governorate } from './../../models/Governorate/governorate.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { GovernorateService } from '../../services/governorate-service';
import { OrderService } from '../../services/order-service';
import { IAddOrder } from '../../models/Order/AddOrder.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  checkoutForm!: FormGroup;
  govForm!: FormGroup;

  cartItems: any[] = [];
  cartTotal = 0;
  currentGovernorates: Governorate[] = [];
  deliveryCost: number = 0;
  isSubmitting: boolean = false;
  editingGovId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private governateservice: GovernorateService,
    private cartService: CartService,
    private payService: PayService,
    private orderService: OrderService,
    private authService :AuthService ,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load cart
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getSubtotal();

    // ---------- MAIN CHECKOUT FORM ----------
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern('^01[0-2,5]{1}[0-9]{8}$')]
      ],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorateId: [null, Validators.required],

      // full / deposit (how much to pay now)
      onlinePaymentType: ['full', Validators.required],

      // paymob / instapay / cashOnDelivery ... (which channel)
      paymentMethod: ['paymob', Validators.required]
    });

    // ---------- GOVERNORATE MODAL FORM ----------
    this.govForm = this.fb.group({
      name: ['', Validators.required],
      deliveryPrice: [null, [Validators.required, Validators.min(0)]]
    });

    // Load governorates list
    this.loadGovernorates();

    // Recalculate delivery cost when governorate changes
    this.checkoutForm.get('governorateId')?.valueChanges.subscribe(selectedId => {
      const selectedGov = this.currentGovernorates.find(g => g.id == selectedId);
      this.deliveryCost = selectedGov ? selectedGov.deliveryPrice : 0;
      this.cdr.detectChanges();
    });

    // If cart is empty, redirect
    if (this.cartItems.length === 0) {
      this.router.navigate(['/products']);
    }
  }
  private startPaymobPayment(
  orderId: number,
  amountToPay: number,
  formValues: any
) {
  const amountCents = Math.round(amountToPay * 100);

  // find governorate name from selected id (nice for billing street/city)
  const selectedGov = this.currentGovernorates.find(
    g => g.id == formValues.governorateId
  );
  const govName = selectedGov?.governorateName || '';

  const fullName: string = formValues.fullName || '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Customer';

  const startPaymentReq = {
    merchantOrderId: orderId.toString(),
    amountCents: amountCents,

    // 1 = card, 2 = wallet (your backend logic)
    method: formValues.paymentMethod === 'wallet' ? 2 : 1,

    // wallet-specific
    walletPhone: formValues.paymentMethod === 'wallet' ? formValues.phone : null,

    // billing info coming directly from customer's input:
    firstName: firstName,
    lastName: lastName,
    email: formValues.email,
    phoneNumber: formValues.phone,

    // you can split address however you like; simplest:
    street: formValues.address,
    city: formValues.city || govName,
    country: 'EG'
  };

  this.payService.startPayment(startPaymentReq)
    .subscribe({
      next: res => {
        this.isSubmitting = false;
        const redirectUrl = res.checkoutUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.error('startPayment: no redirect URL', res);
        }
      },
      error: err => {
        this.isSubmitting = false;
        console.error('startPayment error', err);
      }
    });
}
  loadGovernorates() {
    this.governateservice.getAll().subscribe(data => {
      this.currentGovernorates = data;
      this.cdr.detectChanges();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  placeOrder() {
    if (this.checkoutForm.invalid) return;

    const formValues = this.checkoutForm.value;
    const totalOrderAmount = this.cartTotal + this.deliveryCost;

    const isDeposit = formValues.onlinePaymentType === 'deposit';
    const paid = isDeposit ? this.deliveryCost : totalOrderAmount;
    const remaining = isDeposit ? this.cartTotal : 0;

    const orderPayload: IAddOrder = {
      userId: 'user-id-placeholder',
      ownerName: formValues.fullName,
      ownerPhone: formValues.phone,
      address: `${formValues.address}, ${formValues.city}`,
      // <-- now using the chosen payment method
      paymentMethod: formValues.paymentMethod,
      deliveryPrice: this.deliveryCost,
      totalAmount: totalOrderAmount,
      paidAmount: paid,
      remainingAmount: remaining,
      orderItems: this.cartItems.map(item => ({
        productVariantId: item.variant.id,
        quantity: item.quantity
      }))
    };

    console.log('Mapped Payload:', orderPayload);

    this.isSubmitting = true;

    this.orderService.AddOrder(orderPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cartService.clearCart();
        this.router.navigate(['/manage/orders']);
      },
      error: err => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  // ---------- GOVERNORATE MODAL ACTIONS ----------

  saveGovernorate() {
    if (this.govForm.invalid) return;

    const newGov = {
      governorateName: this.govForm.value.name,
      deliveryPrice: this.govForm.value.deliveryPrice
    };

    this.governateservice.add(newGov).subscribe(() => {
      this.govForm.reset();
      this.loadGovernorates();
    });
  }

  startEdit(id: number) {
    this.editingGovId = id;
  }

  cancelEdit() {
    this.editingGovId = null;
    this.loadGovernorates();
  }

  updateGovernorate(gov: any) {
    const updatedPayload = {
      governorateName: gov.governorateName,
      deliveryPrice: gov.deliveryPrice
    };

    this.governateservice.update(gov.id, updatedPayload).subscribe(() => {
      this.editingGovId = null;
      this.loadGovernorates();
    });
  }

  deleteGovernorate(id: number) {
    if (confirm('Are you sure you want to delete this area?')) {
      this.governateservice.delete(id).subscribe(() => {
        this.loadGovernorates();
      });
    }
  }
}