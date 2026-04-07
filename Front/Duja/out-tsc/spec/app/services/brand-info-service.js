import { __decorate } from "tslib";
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
let BrandInfoService = class BrandInfoService {
    http;
    BrandInfoAPIURL = `${environment.apiUrl}/BrandInfo`;
    brandInfo = signal(null);
    constructor(http) {
        this.http = http;
    }
    getBrandInfo() {
        return this.http.get(this.BrandInfoAPIURL).pipe(tap(data => this.brandInfo.set(data)));
    }
    updateInfo(brand) {
        return this.http.put(this.BrandInfoAPIURL, brand).pipe(tap(() => this.brandInfo.set(brand)));
    }
};
BrandInfoService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BrandInfoService);
export { BrandInfoService };
