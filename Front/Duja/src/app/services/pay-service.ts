import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StartPaymentRequest, StartPaymentResponse } from '../models/Payment/start-payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayService {
  private PaymentUrl = '/api/Payments';
  constructor(private http: HttpClient) { }

  startPayment(body: StartPaymentRequest): Observable<StartPaymentResponse> {
    return this.http.post<StartPaymentResponse>(
      `${this.PaymentUrl}/startPayment`,
      body
    );
  }
  }
