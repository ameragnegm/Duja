import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let ProductService = class ProductService {
    http;
    ProductApiURL = `${environment.apiUrl}/Products`;
    constructor(http) {
        this.http = http;
    }
    getProducts() {
        return this.http.get(this.ProductApiURL);
    }
    getproductByID(id) {
        return this.http.get(`${this.ProductApiURL}/${id}`);
    }
    AddproductDb(product) {
        return this.http.post(`${this.ProductApiURL}`, product);
    }
    UpdateProductDb(id, product) {
        return this.http.put(`${this.ProductApiURL}/${id}`, product);
    }
    DeleteProduct(productID) {
        return this.http.delete(`${this.ProductApiURL}/${productID}`);
    }
    getProductFormData(id) {
        const url = id ? `${this.ProductApiURL}/DataForm/${id}` : `${this.ProductApiURL}/DataForm/0`;
        return this.http.get(url);
    }
    DeleteSpecificProductImages(productid, ImagesIDs) {
        return this.http.delete(`${this.ProductApiURL}/${productid}/images`, {
            body: ImagesIDs
        });
    }
};
ProductService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ProductService);
export { ProductService };
