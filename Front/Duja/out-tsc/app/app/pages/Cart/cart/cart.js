import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
let Cart = class Cart {
    cdr;
    sizeService;
    colorService;
    cartService;
    global;
    cartItems = [];
    cartSubtotal = 0;
    allSizes = [];
    allColors = [];
    editingItem = null; // The item currently being edited
    editAvailableColors = []; // Colors available for the selected size
    // Temporary selections
    editSizeId = null;
    editColorId = null;
    constructor(cdr, sizeService, colorService, cartService, global) {
        this.cdr = cdr;
        this.sizeService = sizeService;
        this.colorService = colorService;
        this.cartService = cartService;
        this.global = global;
    }
    ngOnInit() {
        forkJoin({
            sizes: this.sizeService.getallSizes(),
            colors: this.colorService.getallColors()
        }).subscribe(data => {
            this.allSizes = data.sizes;
            this.allColors = data.colors;
            this.cdr.detectChanges();
        });
        this.cartService.cart$.subscribe(items => {
            this.cartItems = items;
            this.cdr.detectChanges();
            this.calculateTotal();
        });
        console.log(this.cartItems);
    }
    startEditing(item) {
        this.editingItem = item;
        this.editSizeId = item.variant.sizeID;
        this.editColorId = item.variant.colorID;
        // Initialize the color dropdown for the current size
        this.updateAvailableColorsForEdit(item.product.variants);
    }
    // In cart.component.ts
    // Helper to get available sizes for a specific cart item's product
    getAvailableSizesForItem(item) {
        if (!item.product || !item.product.variants)
            return [];
        const sizeIds = item.product.variants.map(v => v.sizeID);
        const uniqueSizeIds = [...new Set(sizeIds)];
        return this.allSizes.filter(s => uniqueSizeIds.includes(s.id));
    }
    // Helper to get available colors for a specific cart item's product AND selected size
    getAvailableColorsForItem(item, selectedSizeId) {
        if (!item.product || !item.product.variants || !selectedSizeId)
            return [];
        const validVariants = item.product.variants.filter(v => v.sizeID == selectedSizeId);
        const colorIds = validVariants.map(v => v.colorID);
        const uniqueColorIds = [...new Set(colorIds)];
        return this.allColors.filter(c => uniqueColorIds.includes(c.id));
    }
    // 2. Cancel Editing
    cancelEdit() {
        this.editingItem = null;
        this.editSizeId = null;
        this.editColorId = null;
    }
    // 3. Save Changes
    saveEdit() {
        if (!this.editingItem || !this.editSizeId || !this.editColorId)
            return;
        // Find the full variant object based on IDs
        const newVariant = this.editingItem.product.variants.find(v => v.sizeID == this.editSizeId &&
            v.colorID == this.editColorId);
        if (newVariant) {
            this.cartService.updateCartItemVariant(this.editingItem, newVariant);
            this.cancelEdit(); // Close edit mode
        }
        else {
            alert("This combination is not available.");
        }
    }
    // Helper: Filter colors when size changes in the cart
    onEditSizeChange(variants) {
        this.editColorId = null; // Reset color
        this.updateAvailableColorsForEdit(variants);
    }
    updateAvailableColorsForEdit(variants) {
        // Filter variants by the selected Size ID
        const validVariants = variants.filter(v => v.sizeID == this.editSizeId);
        const validColorIds = validVariants.map(v => v.colorID);
        // Filter master colors list
        this.editAvailableColors = this.allColors.filter(c => validColorIds.includes(c.id));
    }
    // Helper to get Size Name (e.g., "Large") from ID
    getSizeName(id) {
        const size = this.allSizes.find(s => s.id === id);
        return size ? size.name : 'Unknown';
    }
    // Helper to get Color Name (e.g., "Red") from ID
    getColorName(id) {
        const color = this.allColors.find(c => c.id === id);
        return color ? color.name : 'Unknown';
    }
    increaseQty(item) {
        // Optional: Check stock limit here using item.variant.stockQuantity
        if (item.quantity < item.variant.stockQuantity) {
            this.cartService.updateQuantity(item, item.quantity + 1);
        }
        else {
            alert(`Max stock reached! Only ${item.variant.stockQuantity} available.`);
        }
    }
    decreaseQty(item) {
        if (item.quantity > 1) {
            this.cartService.updateQuantity(item, item.quantity - 1);
        }
    }
    removeItem(item) {
        this.cartService.removeFromCart(item);
    }
    calculateTotal() {
        this.cartSubtotal = this.cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }
    goToCheckout() { }
};
Cart = __decorate([
    Component({
        selector: 'app-cart',
        imports: [FormsModule, CurrencyPipe, RouterLink],
        templateUrl: './cart.html',
        styleUrl: './cart.css'
    })
], Cart);
export { Cart };
