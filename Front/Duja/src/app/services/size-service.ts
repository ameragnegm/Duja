import { appConfig } from './../app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Isize } from '../models/Sizes/size.model';
import { environment } from '../../environments/environment';
import { IAddSize } from '../models/Sizes/AddSize.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  SizeAPIURL = `${environment.apiUrl}/size`;
  
  constructor(private http: HttpClient) { }

  // GET: api/Size
  getallSizes(): Observable<Isize[]> {
    return this.http.get<Isize[]>(this.SizeAPIURL);
  }

  // POST: api/Size
  addSize(size: IAddSize): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(this.SizeAPIURL, size);
  }

  // PUT: api/Size/{id}
  updateSize(id: number, size:IAddSize): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.SizeAPIURL}/${id}`, size);
  }

  // DELETE: api/Size/{id}
  deleteSize(id: number): Observable<ApiResponce> {
    return this.http.delete<any>(`${this.SizeAPIURL}/${id}`);
  }
}