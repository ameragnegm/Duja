import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let Ad = class Ad {
    http;
    AdsAPIURL = `${environment.apiUrl}/Ads`;
    constructor(http) {
        this.http = http;
    }
    getAllAds() {
        return this.http.get(this.AdsAPIURL);
    }
    uploadAd(file) {
        const formData = new FormData();
        formData.append('AdImage', file);
        return this.http.post(this.AdsAPIURL, formData);
    }
    deleteAd(id) {
        return this.http.delete(`${this.AdsAPIURL}/${id}`);
    }
    deleteAllAds() {
        return this.http.delete(`${this.AdsAPIURL}/all`);
    }
};
Ad = __decorate([
    Injectable({
        providedIn: 'root'
    })
], Ad);
export { Ad };
