import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let ColorService = class ColorService {
    http;
    ColorAPIURL = environment.apiUrl + '/color';
    constructor(http) {
        this.http = http;
    }
    // GET: api/color
    getallColors() {
        return this.http.get(this.ColorAPIURL);
    }
    // POST: api/color
    addColor(color) {
        return this.http.post(this.ColorAPIURL, color);
    }
    // PUT: api/color/{id}
    updateColor(id, color) {
        return this.http.put(`${this.ColorAPIURL}/${id}`, color);
    }
    // DELETE: api/color/{id}
    deleteColor(id) {
        return this.http.delete(`${this.ColorAPIURL}/${id}`);
    }
};
ColorService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ColorService);
export { ColorService };
