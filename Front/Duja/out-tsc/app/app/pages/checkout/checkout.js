import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
let Checkout = class Checkout {
    fb;
    cdr;
    governateservice;
    cartService;
    payService;
    orderService;
    authService;
    router;
    checkoutForm;
    govForm;
    cartItems = [];
    cartTotal = 0;
    currentGovernorates = [];
    deliveryCost = 0;
    isSubmitting = false;
    editingGovId = null;
    constructor(fb, cdr, governateservice, cartService, payService, orderService, authService, router) {
        this.fb = fb;
        this.cdr = cdr;
        this.governateservice = governateservice;
        this.cartService = cartService;
        this.payService = payService;
        this.orderService = orderService;
        this.authService = authService;
        this.router = router;
    }
    ngOnInit() {
        // Load cart
        this.cartItems = this.cartService.getCartItems();
        this.cartTotal = this.cartService.getSubtotal();
        // If cart is empty, redirect out early
        if (this.cartItems.length === 0) {
            this.router.navigate(['/products']);
            return;
        }
        // ---------- MAIN CHECKOUT FORM ----------
        this.checkoutForm = this.fb.group({
            fullName: ['', Validators.required],
            // NEW: Paymob strictly requires an email address to process payments!
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^01[0-2,5]{1}[0-9]{8}$')]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            governorateId: [null, Validators.required],
            // full / deposit
            onlinePaymentType: ['full', Validators.required],
            // card / wallet / instapay
            paymentMethod: ['card', Validators.required]
        });
        // ---------- GOVERNORATE MODAL FORM ----------
        this.govForm = this.fb.group({
            name: ['', Validators.required],
            deliveryPrice: [null, [Validators.required, Validators.min(0)]]
        });
        this.loadGovernorates();
        // Recalculate delivery cost when governorate changes
        this.checkoutForm.get('governorateId')?.valueChanges.subscribe(selectedId => {
            const selectedGov = this.currentGovernorates.find(g => g.id == selectedId);
            this.deliveryCost = selectedGov ? selectedGov.deliveryPrice : 0;
            this.cdr.detectChanges();
        });
    }
    loadGovernorates() {
        this.governateservice.getAll().subscribe(data => {
            this.currentGovernorates = data;
            this.cdr.detectChanges();
        });
    }
    isFieldInvalid(fieldName) {
        const field = this.checkoutForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
    // ---------- STEP 1: SAVE ORDER TO YOUR DB ----------
    placeOrder() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }
        const formValues = this.checkoutForm.value;
        const totalOrderAmount = this.cartTotal + this.deliveryCost;
        const isDeposit = formValues.onlinePaymentType === 'deposit';
        const paid = isDeposit ? this.deliveryCost : totalOrderAmount;
        const remaining = isDeposit ? this.cartTotal : 0;
        const orderPayload = {
            userId: 'user-id-placeholder', // Replace with real user ID if logged in
            ownerName: formValues.fullName,
            ownerPhone: formValues.phone,
            address: `${formValues.address}, ${formValues.city}`,
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
        this.isSubmitting = true;
        // Save order to your database first
        this.orderService.AddOrder(orderPayload).subscribe({
            next: (res) => {
                // Assume your backend returns the newly created Order ID in the response.
                // If it doesn't, we fallback to a timestamp so Paymob doesn't crash.
                const dbOrderId = res?.id?.toString() || res?.orderId?.toString() || Date.now().toString();
                // Check if the user wants to pay via Paymob (Card or Wallet)
                if (formValues.paymentMethod === 'card' || formValues.paymentMethod === 'wallet') {
                    // Call the Paymob logic
                    this.startPaymobPayment(dbOrderId, paid, formValues);
                }
                else {
                    // It's Instapay or Cash on Delivery. No Paymob needed!
                    this.isSubmitting = false;
                    this.cartService.clearCart();
                    this.router.navigate(['/manage/orders']); // Redirect to success page
                }
            },
            error: err => {
                this.isSubmitting = false;
                console.error('Failed to save order to database', err);
                alert('Failed to place order. Please try again.');
            }
        });
    }
    startPaymobPayment(orderId, amountToPay, formValues) {
        const amountCents = Math.round(amountToPay * 100);
        const fullName = formValues.fullName || '';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Customer';
        const startPaymentReq = {
            merchantOrderId: orderId,
            amountCents: amountCents,
            method: formValues.paymentMethod === 'wallet' ? 2 : 1,
            walletPhone: formValues.paymentMethod === 'wallet' ? formValues.phone : '',
            firstName: firstName,
            lastName: lastName,
            email: formValues.email,
            phoneNumber: formValues.phone,
        };
        this.payService.startPayment(startPaymentReq).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                if (res.checkoutUrl) {
                    this.cartService.clearCart();
                    window.location.href = res.checkoutUrl;
                }
                else {
                    console.error('startPayment: no redirect URL', res);
                    // ROLLBACK: Backend returned success, but no URL was found
                    this.rollbackOrder(orderId, 'Payment initiated, but no checkout URL was returned.');
                }
            },
            error: (err) => {
                console.error('startPayment error', err);
                // ROLLBACK: The API crashed (e.g., 500 error for invalid wallet number)
                this.rollbackOrder(orderId, 'Failed to connect to the payment gateway. Please verify your details.');
            }
        });
    }
    // ---------- GOVERNORATE MODAL ACTIONS ----------
    saveGovernorate() {
        if (this.govForm.invalid)
            return;
        const newGov = {
            governorateName: this.govForm.value.name,
            deliveryPrice: this.govForm.value.deliveryPrice
        };
        this.governateservice.add(newGov).subscribe(() => {
            this.govForm.reset();
            this.loadGovernorates();
        });
    }
    startEdit(id) { this.editingGovId = id; }
    cancelEdit() { this.editingGovId = null; this.loadGovernorates(); }
    updateGovernorate(gov) {
        const updatedPayload = {
            governorateName: gov.governorateName,
            deliveryPrice: gov.deliveryPrice
        };
        this.governateservice.update(gov.id, updatedPayload).subscribe(() => {
            this.editingGovId = null;
            this.loadGovernorates();
        });
    }
    deleteGovernorate(id) {
        if (confirm('Are you sure you want to delete this area?')) {
            this.governateservice.delete(id).subscribe(() => this.loadGovernorates());
        }
    }
    // NEW HELPER FUNCTION: Deletes the order if payment fails to initialize
    rollbackOrder(orderId, errorMessage) {
        // Note: If your backend requires a number, use Number(orderId)
        this.orderService.DeleteOrder(Number(orderId)).subscribe({
            next: () => {
                this.isSubmitting = false;
                alert(errorMessage + ' The pending order has been cancelled.');
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Failed to delete orphaned order', err);
                alert(errorMessage);
            }
        });
    }
};
Checkout = __decorate([
    Component({
        selector: 'app-checkout',
        standalone: true,
        imports: [CurrencyPipe, ReactiveFormsModule, CommonModule, FormsModule],
        templateUrl: './checkout.html',
        styleUrl: './checkout.css'
    })
], Checkout);
export { Checkout };
