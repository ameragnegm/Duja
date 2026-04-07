import { __decorate } from "tslib";
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Optional, but good if you need ngClass/ngIf
import { FormsModule } from '@angular/forms'; // REQUIRED for [(ngModel)] in the search dropdowns!
import { environment } from '../../../environments/environment';
let Header = class Header {
    productservice;
    categoryservice;
    authservice;
    cartService;
    cdr;
    // ==========================================
    // 1. GLOBAL VARIABLES & CONFIG
    // ==========================================
    apiBaseUrl = environment.baseUrl;
    isScrolled = false;
    isMenuCollapsed = true;
    // ==========================================
    // 2. DATA ARRAYS
    // ==========================================
    AllProducts = [];
    Categories = []; // Needed for the category dropdown in search
    // ==========================================
    // 3. AUTH & CART VARIABLES
    // ==========================================
    user;
    isLoggedIn = false;
    cartCount = 0;
    // ==========================================
    // 4. SEARCH UI VARIABLES
    // ==========================================
    isSearchActive = false;
    searchQuery = '';
    selectedSearchCategory = 'all';
    selectedSort = 'newest';
    searchResults = [];
    constructor(productservice, categoryservice, // Inject Category Service
    authservice, cartService, cdr) {
        this.productservice = productservice;
        this.categoryservice = categoryservice;
        this.authservice = authservice;
        this.cartService = cartService;
        this.cdr = cdr;
    }
    // ==========================================
    // 5. LIFECYCLE HOOKS (OnInit, OnDestroy)
    // ==========================================
    ngOnInit() {
        // Scroll Listener
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.onScroll();
        // Cart Listener
        this.cartService.cart$.subscribe(items => {
            this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
        });
        // Auth Listener
        this.authservice.user$.subscribe(u => {
            this.user = u;
            this.isLoggedIn = !!u;
        });
        // Pre-load categories so the search dropdown has data!
        this.loadCategories();
    }
    ngOnDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    }
    // ==========================================
    // 6. SCROLL & MENU LOGIC
    // ==========================================
    onScroll = () => {
        const nav = document.getElementById('navbar');
        if (!nav)
            return;
        if (window.scrollY > 20)
            nav.classList.add('scrolled');
        else
            nav.classList.remove('scrolled');
    };
    onWindowScroll() {
        this.isScrolled = window.scrollY > 100;
    }
    toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
    }
    // ==========================================
    // 7. AUTH LOGIC
    // ==========================================
    hasRole(role) {
        return this.authservice.hasRole(role);
    }
    logout() {
        this.authservice.logout();
    }
    // ==========================================
    // 8. DATA LOADING (API CALLS)
    // ==========================================
    loadProducts() {
        this.productservice.getProducts().subscribe({
            next: (data) => {
                this.AllProducts = data;
                this.searchResults = [...this.AllProducts];
                this.cdr.detectChanges();
            }
        });
    }
    loadCategories() {
        this.categoryservice.getcategories().subscribe({
            next: (data) => {
                this.Categories = data;
            }
        });
    }
    // ==========================================
    // 9. SEARCH & FILTER LOGIC
    // ==========================================
    openSearch() {
        this.loadProducts(); // Load products when they open the search bar
        this.isSearchActive = true;
        this.searchQuery = '';
        this.applyFilters(); // Reset everything
    }
    closeSearch() {
        this.isSearchActive = false;
    }
    toggleSearch() {
        if (this.isSearchActive) {
            this.closeSearch();
        }
        else {
            this.openSearch();
        }
    }
    clearSearch() {
        this.searchQuery = '';
        this.searchResults = [...this.AllProducts];
    }
    resetSearch() {
        this.searchQuery = '';
        this.selectedSearchCategory = 'all';
        this.selectedSort = 'newest';
        this.applyFilters();
    }
    onSearch(event) {
        this.searchQuery = event.target.value;
        this.applyFilters();
    }
    // The Master Filter Function
    applyFilters() {
        // 1. Start with all products
        let filtered = [...this.AllProducts];
        // 2. Filter by Search Text
        if (this.searchQuery.trim() !== '') {
            const lowerQuery = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery));
        }
        // 3. Filter by Category
        if (this.selectedSearchCategory !== 'all') {
            filtered = filtered.filter(p => p.categoryId === Number(this.selectedSearchCategory));
        }
        // 4. Sort the Results
        if (this.selectedSort === 'newest') {
            filtered.sort((a, b) => b.id - a.id); // Assuming higher ID = newer
        }
        else if (this.selectedSort === 'oldest') {
            filtered.sort((a, b) => a.id - b.id);
        }
        else if (this.selectedSort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        }
        else if (this.selectedSort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }
        // Update the screen
        this.searchResults = filtered;
    }
};
__decorate([
    HostListener('window:scroll', [])
], Header.prototype, "onWindowScroll", null);
Header = __decorate([
    Component({
        selector: 'app-header',
        standalone: true, // Assuming you are using standalone components
        imports: [RouterLink, CommonModule, FormsModule],
        templateUrl: './header.html',
        styleUrl: './header.css'
    })
], Header);
export { Header };
