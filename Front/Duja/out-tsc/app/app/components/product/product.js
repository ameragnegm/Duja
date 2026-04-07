import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
let Product = class Product {
    route;
    global;
    product;
    deleteevent = new EventEmitter();
    constructor(route, global) {
        this.route = route;
        this.global = global;
    }
    DeleteProduct(id) {
        if (confirm("Are you sure to Delete this product ?")) {
            this.deleteevent.emit(this.product?.id);
        }
    }
    hasStock(product) {
        if (product.variants && product.variants.length > 0) {
            return product.variants.some((v) => v.stockQuantity > 0);
        }
        return product.stockQuantity > 0;
    }
    goToDetails(id) {
        this.route.navigate(['/product', id]);
    }
};
__decorate([
    Input()
], Product.prototype, "product", void 0);
__decorate([
    Output()
], Product.prototype, "deleteevent", void 0);
Product = __decorate([
    Component({
        selector: 'app-product',
        imports: [CurrencyPipe],
        templateUrl: './product.html',
        styleUrl: './product.css'
    })
], Product);
export { Product };
