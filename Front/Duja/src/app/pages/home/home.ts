import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { IProduct } from '../../models/Product/product.model';
import { Icategory } from '../../models/Categories/category.model';
import { Product } from '../../components/product/product';
import { Ad } from '../../services/ad';
import { IBrandAD } from '../../models/BrandAd.model';
import { Router, RouterLink } from '@angular/router';
import { Global } from '../../shared/global';
import { environment } from '../../../environments/environment';
import { CategorySlider } from "../../components/category-slider/category-slider";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CategorySlider],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  readonly apiBaseUrl = environment.baseUrl;

  currentSlide = 0;
  slideInterval: any;

  Products: IProduct[] = [];
  FilteredProducts: IProduct[] = [];
  Categories: Icategory[] = [];
  brandAds: IBrandAD[] = [];

  searchTerm: string = '';
  selectedCategory: string = 'all';

  constructor(
    private router : Router , 
    private productservice: ProductService,
    private adservice: Ad,
    private categoryservice: CategoryService,
    private Cdr: ChangeDetectorRef,
    public global: Global
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.startSlideshow();
  }

  startSlideshow() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      if (this.brandAds && this.brandAds.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.brandAds.length;
        this.Cdr.detectChanges();
      }
    }, 2500);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  loadData(){
    this.adservice.getAllAds().subscribe(
      {
        next: (data) => {
          this.brandAds = data;
          if (data) {
            this.brandAds = data.map(ad => ({
              ...ad,
              imageUrl: this.global.getImageUrl(ad.imageUrl)
            }));
          }
          this.Cdr.detectChanges(); }
        });

    this.productservice.getProducts().subscribe({
      next: (data) => {
        this.Products = data;
        this.FilteredProducts = data;
        this.Cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load products', err)
    });

    this.categoryservice.getcategories().subscribe({
      next: (data) => {
        this.Categories = data;
        this.Cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

      

  filter() {
    this.FilteredProducts = this.global.filterProducts(this.Products, this.selectedCategory, this.searchTerm);
  }

  OnselectCategory(event: Event) {
    const input = event.target as HTMLSelectElement;
    this.selectedCategory = input.value;
    this.filter();
  }

  selectCategory(id: number) {
    this.router.navigate(['/products'], { queryParams: { categoryId: id } });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filter();
  }
}