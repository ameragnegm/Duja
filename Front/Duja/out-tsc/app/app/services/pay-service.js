import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let PayService = class PayService {
    http;
    PaymentUrl = `${environment.apiUrl}/Payments`;
    constructor(http) {
        this.http = http;
    }
    startPayment(body) {
        return this.http.post(`${this.PaymentUrl}/startPayment`, body);
    }
};
PayService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], PayService);
export { PayService };
