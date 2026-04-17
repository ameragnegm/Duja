import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDiscount } from '../models/Discount/Discount.model';
import { Observable } from 'rxjs';
import { ICreateDiscount } from '../models/Discount/CreateDiscount.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private discountAPIURL: string = `${environment.apiUrl}/Discounts`;

  constructor(private http: HttpClient) {}

  getAllDiscounts(): Observable<IDiscount[]> {
    return this.http.get<IDiscount[]>(this.discountAPIURL);
  }

  getDiscountById(id: number | string): Observable<IDiscount> {
    return this.http.get<IDiscount>(`${this.discountAPIURL}/${id}`);
  }

  getActiveDiscounts(): Observable<IDiscount[]> {
    return this.http.get<IDiscount[]>(`${this.discountAPIURL}/active`);
  }

  createDiscount(data: ICreateDiscount): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(this.discountAPIURL, data);
  }

  updateDiscount(id: number | string, data: ICreateDiscount): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.discountAPIURL}/${id}`, data);
  }

  deleteDiscount(id: number | string): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.discountAPIURL}/${id}`);
  }
}
