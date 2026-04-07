import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
let OrderDetails = class OrderDetails {
    orderService;
    router;
    cdr;
    orderservice;
    route;
    global;
    order;
    orderItems = [];
    message;
    orderId = '';
    isLoading = true;
    constructor(orderService, router, cdr, orderservice, route, global) {
        this.orderService = orderService;
        this.router = router;
        this.cdr = cdr;
        this.orderservice = orderservice;
        this.route = route;
        this.global = global;
    }
    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id');
        if (this.orderId) {
            this.orderservice.getSpecificOrder(this.orderId).subscribe({
                next: (data) => {
                    this.order = data;
                    console.log(this.order);
                    this.orderItems = this.order.orderItems;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
            this.orderservice.getOrderItems(this.orderId).subscribe({
                next: (data) => {
                    this.orderItems = data;
                    this.cdr.detectChanges();
                }
            });
        }
    }
    ConfirmOrder() {
        if (confirm("Are you sure you want to confirm this order?")) {
            this.orderService.confirmOrder(this.order.id).subscribe(() => {
                this.cdr.detectChanges();
            });
        }
    }
    onImgError(e) {
        e.target.src = 'assets/no-image.png';
    }
    DeleteCurrentOrder() {
        const ok = confirm('Are you sure you want to delete this order?');
        if (!ok)
            return;
        this.orderservice.DeleteOrder(Number(this.orderId)).subscribe({
            next: (res) => {
                alert('Order deleted successfully.');
                this.router.navigate(['/manage/orders']);
            },
            error: (err) => {
                console.error(err);
                alert('Failed to delete the order.');
            }
        });
    }
};
OrderDetails = __decorate([
    Component({
        selector: 'app-order-details',
        imports: [CurrencyPipe, DatePipe, FormsModule, CommonModule],
        templateUrl: './order-details.html',
        styleUrl: './order-details.css'
    })
], OrderDetails);
export { OrderDetails };
