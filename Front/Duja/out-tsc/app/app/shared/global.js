import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let Global = class Global {
    location;
    authService;
    apiBaseUrl = environment.baseUrl;
    constructor(location, authService) {
        this.location = location;
        this.authService = authService;
    }
    /**
     * Constructs a full URL for an image.
     * Handles leading slashes in the path to ensure valid URLs.
     */
    getImageUrl(imageUrl) {
        if (!imageUrl)
            return 'assets/no-image.png'; // Fallback or placeholder
        if (imageUrl.startsWith('http'))
            return imageUrl; // Already a full URL
        // Ensure one slash between base and path
        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        return `${this.apiBaseUrl}${cleanPath}`;
    }
    /**
     * Navigates back to the previous location in history.
     */
    goBack() {
        this.location.back();
    }
    /**
     * Checks if a user has a specific role.
     */
    hasRole(role) {
        return this.authService.hasRole(role);
    }
    /**
     * Checks if a product is sold out (no stock in any variant).
     */
    isSoldOut(product) {
        if (!product.variants || product.variants.length === 0)
            return true;
        return product.variants.every(v => v.stockQuantity <= 0);
    }
    /**
     * Filters a list of products based on category and search term.
     */
    filterProducts(products, categoryId, searchTerm) {
        let filtered = products;
        // Filter by Category
        if (categoryId && categoryId !== 'all') {
            filtered = filtered.filter(p => p.categoryId == Number(categoryId));
        }
        // Filter by Search Term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
        }
        return filtered;
    }
};
Global = __decorate([
    Injectable({
        providedIn: 'root'
    })
], Global);
export { Global };
