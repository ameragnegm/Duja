import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let Footer = class Footer {
    brandservice;
    isLoading = true;
    constructor(brandservice) {
        this.brandservice = brandservice;
    }
    ngOnInit() {
        if (!this.brandservice.brandInfo()) {
            this.loadBrandInfo();
        }
        else {
            this.isLoading = false;
        }
    }
    loadBrandInfo() {
        this.brandservice.getBrandInfo().subscribe({
            next: () => {
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load brand info', err);
                this.isLoading = false;
            }
        });
    }
    cleanWhatsApp(number) {
        if (!number)
            return '';
        return number.replace(/\D/g, '');
    }
};
Footer = __decorate([
    Component({
        selector: 'app-footer',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './footer.html',
        styleUrl: './footer.css'
    })
], Footer);
export { Footer };
