import { __decorate } from "tslib";
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
let GovernorateService = class GovernorateService {
    http;
    GovernorateApiUrl = `${environment.apiUrl}/Governorate`;
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(this.GovernorateApiUrl);
    }
    add(dto) {
        return this.http.post(this.GovernorateApiUrl, dto);
    }
    update(id, dto) {
        return this.http.put(`${this.GovernorateApiUrl}/${id}`, dto);
    }
    delete(id) {
        return this.http.delete(`${this.GovernorateApiUrl}/${id}`);
    }
};
GovernorateService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GovernorateService);
export { GovernorateService };
