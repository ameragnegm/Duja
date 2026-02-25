import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Ad } from '../../../services/ad';
import { IBrandAD } from '../../../models/BrandAd.model';
import { CommonModule } from '@angular/common';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-manage-ads',
  imports: [CommonModule],
  templateUrl: './manage-ads.html',
  styleUrl: './manage-ads.css'
})
export class ManageAds implements OnInit {
  
  constructor(private adService: Ad, private cdr: ChangeDetectorRef, public global: Global) { }

  ads: IBrandAD[] = [];
  selectedFile: File | null = null;
  linkText: string = '/shop'; // Default link


  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adService.getAllAds().subscribe(data => {
      this.ads = data
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) return alert("Please select an image first!");

    this.adService.uploadAd(this.selectedFile).subscribe({
      next: () => {
        alert("Ad Uploaded!");
        this.loadAds(); // Refresh list
        this.selectedFile = null; // Reset
      },
      error: (err) => alert("Upload failed")
    });
  }

  delete(id: number) {
    if (confirm("Are you sure?")) {
      this.adService.deleteAd(id).subscribe(() => this.loadAds());
    }
  }
  deleteAll() {
    if (this.ads.length === 0) return;

    if (confirm("WARNING: This will delete ALL ads. Are you sure?")) {
      this.adService.deleteAllAds().subscribe(() => this.loadAds());
    }
  }
}
