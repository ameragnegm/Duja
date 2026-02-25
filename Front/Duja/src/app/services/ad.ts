import { IBrandAD } from './../models/BrandAd.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Ad {
  AdsAPIURL: string = `${environment.apiUrl}/Ads`;

  constructor(private http: HttpClient) { }
  getAllAds(): Observable<IBrandAD[]> {
    return this.http.get<IBrandAD[]>(this.AdsAPIURL);
  }
  uploadAd(file: File) {
    const formData = new FormData();
    formData.append('AdImage', file);
    return this.http.post(this.AdsAPIURL, formData);
  }
  deleteAd(id: number) {
    return this.http.delete(`${this.AdsAPIURL}/${id}`);
  }
  deleteAllAds() {
    return this.http.delete(`${this.AdsAPIURL}/all`);
  }
} 
