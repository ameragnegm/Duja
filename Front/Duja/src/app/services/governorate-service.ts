import { Governorate } from './../models/Governorate/governorate.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateGovernorate } from '../models/Governorate/creategovernorate.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';

@Injectable({
  providedIn: 'root'
})
export class GovernorateService {
  private GovernorateApiUrl = `${environment.apiUrl}/Governorate`
  constructor(private http: HttpClient ) {}

  getAll(): Observable<Governorate[]> {
    return this.http.get<Governorate[]>(this.GovernorateApiUrl);
  }

  add(dto: CreateGovernorate): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(this.GovernorateApiUrl, dto);
  }

  update(id: number, dto: CreateGovernorate): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.GovernorateApiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.GovernorateApiUrl}/${id}`);
  }
}
