import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let SizeService = class SizeService {
    http;
    SizeAPIURL = `${environment.apiUrl}/size`;
    constructor(http) {
        this.http = http;
    }
    // GET: api/Size
    getallSizes() {
        return this.http.get(this.SizeAPIURL);
    }
    // POST: api/Size
    addSize(size) {
        return this.http.post(this.SizeAPIURL, size);
    }
    // PUT: api/Size/{id}
    updateSize(id, size) {
        return this.http.put(`${this.SizeAPIURL}/${id}`, size);
    }
    // DELETE: api/Size/{id}
    deleteSize(id) {
        return this.http.delete(`${this.SizeAPIURL}/${id}`);
    }
};
SizeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], SizeService);
export { SizeService };
