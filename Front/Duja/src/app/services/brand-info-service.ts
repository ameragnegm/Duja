import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BrandInfo } from '../models/BrandInfo.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';

@Injectable({
  providedIn: 'root'
})
export class BrandInfoService {
    BrandInfoAPIURL: string = `${environment.apiUrl}/BrandInfo`;

  brandInfo = signal<BrandInfo | null>(null);

  constructor(private http: HttpClient) {}

  getBrandInfo() {
    return this.http.get<BrandInfo>(this.BrandInfoAPIURL).pipe(
      tap(data => this.brandInfo.set(data))
    );
  }

  updateInfo(brand: BrandInfo) {
    return this.http.put<ApiResponce>(this.BrandInfoAPIURL, brand).pipe(
      tap(() => this.brandInfo.set(brand))
    );
  }}
