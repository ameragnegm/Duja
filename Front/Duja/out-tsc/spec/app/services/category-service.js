import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let CategoryService = class CategoryService {
    http;
    categoryAPIURL = `${environment.apiUrl}/Category`;
    constructor(http) {
        this.http = http;
    }
    // GET: api/Category
    getcategories() {
        return this.http.get(this.categoryAPIURL);
    }
    // GET: api/Category/5
    getCategoryById(id) {
        return this.http.get(`${this.categoryAPIURL}/${id}`);
    }
    // POST: api/Category
    addCategory(category) {
        return this.http.post(this.categoryAPIURL, category);
    }
    // PUT: api/Category/5
    updateCategory(id, category) {
        return this.http.put(`${this.categoryAPIURL}/${id}`, category);
    }
    // DELETE: api/Category/5
    deleteCategory(id) {
        return this.http.delete(`${this.categoryAPIURL}/${id}`);
    }
};
CategoryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CategoryService);
export { CategoryService };
