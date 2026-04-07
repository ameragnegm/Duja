import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let ManageAds = class ManageAds {
    adService;
    cdr;
    global;
    constructor(adService, cdr, global) {
        this.adService = adService;
        this.cdr = cdr;
        this.global = global;
    }
    ads = [];
    selectedFile = null;
    linkText = '/shop'; // Default link
    ngOnInit() {
        this.loadAds();
    }
    loadAds() {
        this.adService.getAllAds().subscribe(data => {
            this.ads = data;
            this.cdr.detectChanges();
        });
    }
    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }
    upload() {
        if (!this.selectedFile)
            return alert("Please select an image first!");
        this.adService.uploadAd(this.selectedFile).subscribe({
            next: () => {
                alert("Ad Uploaded!");
                this.loadAds(); // Refresh list
                this.selectedFile = null; // Reset
            },
            error: (err) => alert("Upload failed")
        });
    }
    delete(id) {
        if (confirm("Are you sure?")) {
            this.adService.deleteAd(id).subscribe(() => this.loadAds());
        }
    }
    deleteAll() {
        if (this.ads.length === 0)
            return;
        if (confirm("WARNING: This will delete ALL ads. Are you sure?")) {
            this.adService.deleteAllAds().subscribe(() => this.loadAds());
        }
    }
};
ManageAds = __decorate([
    Component({
        selector: 'app-manage-ads',
        imports: [CommonModule],
        templateUrl: './manage-ads.html',
        styleUrl: './manage-ads.css'
    })
], ManageAds);
export { ManageAds };
