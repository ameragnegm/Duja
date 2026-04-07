import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let OrderService = class OrderService {
    http;
    orderURL = environment.apiUrl + "/order";
    orderItemURL = environment.apiUrl + "/OrderItems";
    constructor(http) {
        this.http = http;
    }
    getAllOrders() {
        return this.http.get(this.orderURL);
    }
    getSpecificOrder(id) {
        return this.http.get(`${this.orderURL}/${id}`);
    }
    getOrderItems(orderID) {
        return this.http.get(`${this.orderItemURL}/${orderID}`);
    }
    updateOrder(orderid, order) {
        return this.http.put(`${this.orderURL}/${orderid}`, order);
    }
    confirmOrder(orderId) {
        return this.http.put(`${this.orderURL}/${orderId}/confirm`, {});
    }
    AddOrder(Order) {
        return this.http.post(`${this.orderURL}`, Order);
    }
    DeleteOrder(OrderID) {
        return this.http.delete(`${this.orderURL}/${OrderID}`);
    }
};
OrderService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], OrderService);
export { OrderService };
