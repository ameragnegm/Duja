import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandInfoService } from '../../services/brand-info-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  isLoading = true;

  constructor(public brandservice: BrandInfoService) { }

  ngOnInit(): void {
    if (!this.brandservice.brandInfo()) {
      this.loadBrandInfo();
    } else {
      this.isLoading = false;
    }
  }

  loadBrandInfo(): void {
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
  cleanWhatsApp(number: string): string {
  if (!number) return '';

  return number.replace(/\D/g, '');
}
}