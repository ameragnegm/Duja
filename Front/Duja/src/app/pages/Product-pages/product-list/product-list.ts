import { Product } from '../../../components/product/product';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { IProduct } from '../../../models/Product/product.model';
import { Icategory } from '../../../models/Categories/category.model';
import { CategoryService } from '../../../services/category-service';
import { FormsModule } from '@angular/forms';
import { ApiResponce } from '../../../models/Product/ApiResponce.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Product, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  visibleCount: number = 8;
  Products: IProduct[] = [];
  FilteredProducts: IProduct[] = [];
  Categories: Icategory[] = [];
  Product: IProduct | undefined;
  message !: ApiResponce;
  searchTerm !: string;
  currentCategoryId !: string | null ; 
  selectedCategory !: string;
  private subscription = new Subscription();
  constructor(private route : ActivatedRoute,private productservice: ProductService, private categoryservice: CategoryService, private Cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.currentCategoryId = this.route.snapshot.paramMap.get('categoryId');

    this.productservice.getProducts().subscribe({
      next: (data) => {
        this.Products = data;
        this.FilteredProducts = this.Products;
        this.Cdr.detectChanges();
      }
    })

    this.categoryservice.getcategories().subscribe({
      next: (data) => {
        this.Categories = data;
        this.Cdr.detectChanges();
      }
    })
    this.subscription.add()
  }

  filter() {
    var tempFilterproducts = this.Products;
    if (this.selectedCategory !== 'all') {
      tempFilterproducts = tempFilterproducts.filter(product =>
        product.categoryId == Number(this.selectedCategory)
      )
    }
    if (this.searchTerm) {
      tempFilterproducts = tempFilterproducts.filter(p => p.name.includes(this.searchTerm));
    }
    this.FilteredProducts = tempFilterproducts;
  }
  onDeleteProduct(productID: number | undefined) {
    if (productID) {
      this.productservice.DeleteProduct(String(productID)).subscribe({
        next: (data) => {
          this.FilteredProducts = this.FilteredProducts.filter(p => p.id != productID);
          this.Products = this.Products.filter(p => p.id != productID);
          this.message = data;
          this.Cdr.detectChanges();
          alert(this.message.message);
        }
      })

    }

  }
  OnselectCategory(event: Event) {
    var input = event.target as HTMLSelectElement;
    this.selectedCategory = input.value;
    this.filter();

  }
  onSearch(event: Event) {
    var input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filter();
  }
  onLoadMore() {
    // Increase the count by 8 (or however many you want to add per click)
    this.visibleCount += 8;
  }
}
