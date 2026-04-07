import { __decorate } from "tslib";
import { Product } from '../../../components/product/product';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterLink } from "@angular/router";
let ProductList = class ProductList {
    route;
    productservice;
    categoryservice;
    Cdr;
    visibleCount = 8;
    Products = [];
    FilteredProducts = [];
    Categories = [];
    Product;
    message;
    searchTerm;
    currentCategoryId;
    selectedCategory;
    subscription = new Subscription();
    constructor(route, productservice, categoryservice, Cdr) {
        this.route = route;
        this.productservice = productservice;
        this.categoryservice = categoryservice;
        this.Cdr = Cdr;
    }
    ngOnInit() {
        this.currentCategoryId = this.route.snapshot.paramMap.get('categoryId');
        this.productservice.getProducts().subscribe({
            next: (data) => {
                this.Products = data;
                this.FilteredProducts = this.Products;
                this.Cdr.detectChanges();
            }
        });
        this.categoryservice.getcategories().subscribe({
            next: (data) => {
                this.Categories = data;
                this.Cdr.detectChanges();
            }
        });
        this.subscription.add();
    }
    filter() {
        var tempFilterproducts = this.Products;
        if (this.selectedCategory !== 'all') {
            tempFilterproducts = tempFilterproducts.filter(product => product.categoryId == Number(this.selectedCategory));
        }
        if (this.searchTerm) {
            tempFilterproducts = tempFilterproducts.filter(p => p.name.includes(this.searchTerm));
        }
        this.FilteredProducts = tempFilterproducts;
    }
    onDeleteProduct(productID) {
        if (productID) {
            this.productservice.DeleteProduct(String(productID)).subscribe({
                next: (data) => {
                    this.FilteredProducts = this.FilteredProducts.filter(p => p.id != productID);
                    this.Products = this.Products.filter(p => p.id != productID);
                    this.message = data;
                    this.Cdr.detectChanges();
                    alert(this.message.message);
                }
            });
        }
    }
    OnselectCategory(event) {
        var input = event.target;
        this.selectedCategory = input.value;
        this.filter();
    }
    onSearch(event) {
        var input = event.target;
        this.searchTerm = input.value;
        this.filter();
    }
    onLoadMore() {
        // Increase the count by 8 (or however many you want to add per click)
        this.visibleCount += 8;
    }
};
ProductList = __decorate([
    Component({
        selector: 'app-product-list',
        standalone: true,
        imports: [Product, FormsModule, RouterLink],
        templateUrl: './product-list.html',
        styleUrl: './product-list.css'
    })
], ProductList);
export { ProductList };
