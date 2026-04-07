import { __decorate } from "tslib";
import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
let Management = class Management {
    navContainer;
    tabs = [
        { label: 'Brand', link: 'brand', icon: 'bi bi-gear-fill' },
        { label: 'Products', link: 'products', icon: 'bi bi-box-seam-fill' },
        { label: 'Orders', link: 'orders', icon: 'bi bi-cart-check-fill' },
        { label: 'Ads & Banners', link: 'ads', icon: 'bi bi-megaphone-fill' },
        { label: 'Employees', link: 'employees', icon: 'bi bi-people-fill' }
    ];
    visibleTabs = [];
    overflowTabs = [];
    isMoreOpen = false;
    tabWidths = [130, 145, 130, 170, 145];
    moreButtonWidth = 120;
    navGap = 10;
    navPaddingAllowance = 24;
    ngAfterViewInit() {
        queueMicrotask(() => this.calculateTabs());
    }
    onResize() {
        this.calculateTabs();
        this.closeMoreMenu();
    }
    onDocumentClick(event) {
        const target = event.target;
        if (!target.closest('.more-menu')) {
            this.closeMoreMenu();
        }
    }
    toggleMoreMenu() {
        this.isMoreOpen = !this.isMoreOpen;
    }
    closeMoreMenu() {
        this.isMoreOpen = false;
    }
    calculateTabs() {
        if (!this.navContainer?.nativeElement)
            return;
        const containerWidth = this.navContainer.nativeElement.offsetWidth;
        const availableWidth = containerWidth - this.navPaddingAllowance;
        let usedWidth = 0;
        const visible = [];
        const overflow = [];
        for (let i = 0; i < this.tabs.length; i++) {
            const currentTabWidth = this.tabWidths[i] + this.navGap;
            const remainingTabs = this.tabs.length - (i + 1);
            const needsMoreButton = remainingTabs > 0;
            const reservedWidth = needsMoreButton ? this.moreButtonWidth : 0;
            if (usedWidth + currentTabWidth + reservedWidth <= availableWidth) {
                visible.push(this.tabs[i]);
                usedWidth += currentTabWidth;
            }
            else {
                overflow.push(...this.tabs.slice(i));
                break;
            }
        }
        this.visibleTabs = visible;
        this.overflowTabs = overflow;
    }
};
__decorate([
    ViewChild('navContainer')
], Management.prototype, "navContainer", void 0);
__decorate([
    HostListener('window:resize')
], Management.prototype, "onResize", null);
__decorate([
    HostListener('document:click', ['$event'])
], Management.prototype, "onDocumentClick", null);
Management = __decorate([
    Component({
        selector: 'app-management',
        standalone: true,
        imports: [RouterLink, RouterOutlet, RouterLinkActive],
        templateUrl: './management.html',
        styleUrl: './management.css'
    })
], Management);
export { Management };
