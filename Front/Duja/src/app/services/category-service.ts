import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../models/Categories/category.model';
import { environment } from '../../environments/environment';
import { IAddCategory } from '../models/Categories/AddCategory.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    
  categoryAPIURL: string = `${environment.apiUrl}/Category`;
  
  constructor(private http: HttpClient) {}

  // GET: api/Category
  getcategories(): Observable<Icategory[]> {
    return this.http.get<Icategory[]>(this.categoryAPIURL);
  }

  // GET: api/Category/5
  getCategoryById(id: number): Observable<Icategory> {
    return this.http.get<Icategory>(`${this.categoryAPIURL}/${id}`);
  }

  // POST: api/Category
  addCategory(category: IAddCategory): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(this.categoryAPIURL, category);
  }

  // PUT: api/Category/5
  updateCategory(id: number, category: IAddCategory): Observable<ApiResponce> {
    return this.http.put<ApiResponce>(`${this.categoryAPIURL}/${id}`, category);
  }

  // DELETE: api/Category/5
  deleteCategory(id: number): Observable<ApiResponce> {
    return this.http.delete<ApiResponce>(`${this.categoryAPIURL}/${id}`);
  }
}