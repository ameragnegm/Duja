import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CategorySlider } from "../../components/category-slider/category-slider";
let Home = class Home {
    router;
    productservice;
    adservice;
    categoryservice;
    Cdr;
    global;
    apiBaseUrl = environment.baseUrl;
    currentSlide = 0;
    slideInterval;
    Products = [];
    FilteredProducts = [];
    Categories = [];
    brandAds = [];
    searchTerm = '';
    selectedCategory = 'all';
    constructor(router, productservice, adservice, categoryservice, Cdr, global) {
        this.router = router;
        this.productservice = productservice;
        this.adservice = adservice;
        this.categoryservice = categoryservice;
        this.Cdr = Cdr;
        this.global = global;
    }
    ngOnInit() {
        this.loadData();
        this.startSlideshow();
    }
    startSlideshow() {
        if (this.slideInterval)
            clearInterval(this.slideInterval);
        this.slideInterval = setInterval(() => {
            if (this.brandAds && this.brandAds.length > 0) {
                this.currentSlide = (this.currentSlide + 1) % this.brandAds.length;
                this.Cdr.detectChanges();
            }
        }, 2500);
    }
    ngOnDestroy() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
    loadData() {
        this.adservice.getAllAds().subscribe({
            next: (data) => {
                this.brandAds = data;
                if (data) {
                    this.brandAds = data.map(ad => ({
                        ...ad,
                        imageUrl: this.global.getImageUrl(ad.imageUrl)
                    }));
                }
                this.Cdr.detectChanges();
            }
        });
        this.productservice.getProducts().subscribe({
            next: (data) => {
                this.Products = data;
                this.FilteredProducts = data;
                this.Cdr.detectChanges();
            },
            error: (err) => console.error('Failed to load products', err)
        });
        this.categoryservice.getcategories().subscribe({
            next: (data) => {
                this.Categories = data;
                this.Cdr.detectChanges();
            },
            error: (err) => console.error('Failed to load categories', err)
        });
    }
    filter() {
        this.FilteredProducts = this.global.filterProducts(this.Products, this.selectedCategory, this.searchTerm);
    }
    OnselectCategory(event) {
        const input = event.target;
        this.selectedCategory = input.value;
        this.filter();
    }
    selectCategory(id) {
        this.router.navigate(['/products'], { queryParams: { categoryId: id } });
    }
    onSearch(event) {
        const input = event.target;
        this.searchTerm = input.value;
        this.filter();
    }
    scrollToCategories() {
        const categorySection = document.getElementById('category_shop');
        if (categorySection) {
            categorySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};
Home = __decorate([
    Component({
        selector: 'app-home',
        standalone: true,
        imports: [CommonModule, CategorySlider],
        templateUrl: './home.html',
        styleUrls: ['./home.css']
    })
], Home);
export { Home };
