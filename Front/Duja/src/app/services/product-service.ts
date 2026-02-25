import { IProduct } from '../models/Product/product.model';
import { Product } from './../components/product/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce } from '../models/Product/ApiResponce.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private ProductApiURL: string = `${environment.apiUrl}/Products`;
  constructor(private http: HttpClient) { }


  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.ProductApiURL);
  }
  getproductByID(id: string | null): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.ProductApiURL}/${id}`)
  }
  AddproductDb(product: FormData): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(`${this.ProductApiURL}`, product);
  }
  UpdateProductDb(id: string, product: FormData): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.ProductApiURL}/${id}`, product);
  }
  DeleteProduct(productID: string): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.ProductApiURL}/${productID}`);
  }
  getProductFormData(id: string | null): Observable<any> {
    const url = id ? `${this.ProductApiURL}/DataForm/${id}` : `${this.ProductApiURL}/DataForm/0`;
    return this.http.get(url);
  }
  DeleteSpecificProductImages(productid: number, ImagesIDs: number[]): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.ProductApiURL}/${productid}/images`, {
      body: ImagesIDs
    });
  }

}
