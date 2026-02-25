import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../models/Order/order.model';
import { IOrderItem } from '../models/Order/orderitem.model';
import { IAddOrder } from '../models/Order/AddOrder.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';
import { environment } from '../../environments/environment';
import { IUpdateOrder } from '../models/Order/UpdateOrder.model';
import { AddOrderResponse } from '../models/Order/AddOrderResponse.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderURL: string = environment.apiUrl + "/order";
  orderItemURL: string = environment.apiUrl + "/OrderItems";

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.orderURL);
  }
  getSpecificOrder(id: string | null): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.orderURL}/${id}`);
  }
  getOrderItems(orderID : string | null): Observable<IOrderItem[]>{
    return this.http.get<IOrderItem[]>(`${this.orderItemURL}/${orderID}`);
  }
  updateOrder(orderid:number | null , order :IUpdateOrder):Observable<ApiResponce>{
    return this.http.put<ApiResponce>(`${this.orderURL}/${orderid}`,order);
  }
  confirmOrder(orderId : number | null) : Observable<ApiResponce>{
    return this.http.put<ApiResponce>(`${this.orderURL}/${orderId}/confirm`,{});
  }
  AddOrder(Order : IAddOrder) : Observable<AddOrderResponse>{
    return this.http.post<AddOrderResponse>(`${this.orderURL}`, Order);
  }
  DeleteOrder(OrderID : number ): Observable<ApiResponce>{
    return this.http.delete<ApiResponce>(`${this.orderURL}/${OrderID}`);
  }
}
