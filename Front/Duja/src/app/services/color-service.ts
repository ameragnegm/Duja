import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icolor } from '../models/Colors/color.model';
import { environment } from '../../environments/environment'; 
import { ApiResponce } from '../models/Product/ApiResponce.model';
import { IAddColor } from '../models/Colors/AddColor.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  
  ColorAPIURL: string = environment.apiUrl + '/color';
  
  constructor(private http: HttpClient) {    
  }
  
  // GET: api/color
  getallColors(): Observable<Icolor[]> {
    return this.http.get<Icolor[]>(this.ColorAPIURL);
  }
  
  // POST: api/color
  addColor(color: IAddColor): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(this.ColorAPIURL, color);
  }
  
  // PUT: api/color/{id}
  updateColor(id: number, color: IAddColor): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.ColorAPIURL}/${id}`, color);
  }

  // DELETE: api/color/{id}
  deleteColor(id: number): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.ColorAPIURL}/${id}`);
  }
}