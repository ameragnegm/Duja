import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let CategorySlider = class CategorySlider {
    images = [];
    baseUrl = '';
    currentIndex = 0;
    intervalId;
    ngOnInit() {
        if (this.images && this.images.length > 1) {
            this.startSlideshow();
        }
    }
    startSlideshow() {
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 2000);
    }
    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    getImageUrl(path) {
        if (!path)
            return '';
        if (path.startsWith('http'))
            return path;
        return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
};
__decorate([
    Input()
], CategorySlider.prototype, "images", void 0);
__decorate([
    Input()
], CategorySlider.prototype, "baseUrl", void 0);
CategorySlider = __decorate([
    Component({
        selector: 'app-category-slider',
        imports: [],
        templateUrl: './category-slider.html',
        styleUrl: './category-slider.css'
    })
], CategorySlider);
export { CategorySlider };
