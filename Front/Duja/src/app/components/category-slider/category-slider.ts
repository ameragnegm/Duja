import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-slider',
  imports: [],
  templateUrl: './category-slider.html',
  styleUrl: './category-slider.css'
})
export class CategorySlider implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  
  @Input() baseUrl: string = '';

  currentIndex: number = 0;
  intervalId: any;

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
  
  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path; 
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}