import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountService } from '../../../services/discount-service';
import { ProductService } from '../../../services/product-service';
import { CategoryService } from '../../../services/category-service';
import { Global } from '../../../shared/global';
import { IDiscount } from '../../../models/Discount/Discount.model';
import { ICreateDiscount } from '../../../models/Discount/CreateDiscount.model';

@Component({
  selector: 'app-discount-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount-form.html',
  styleUrl: './discount-form.css'
})
export class DiscountForm implements OnInit {
  discountForm: FormGroup;
  isEditMode = false;
  discountId: string | null = null;
  isLoading = false;

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];

  productSearchTerm = '';
  selectedCategoryId: string = 'all';

  constructor(
    private cdr : ChangeDetectorRef,
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public global: Global
  ) {
    this.discountForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      percentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      isActive: [true],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      productIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.discountId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.discountId;
    console.log(this.discountId);

    this.loadCategories();
    this.loadProducts();

    if (this.isEditMode && this.discountId) {
      this.loadDiscountById(this.discountId);
    }
    this.cdr.detectChanges();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.applyProductFilters();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getcategories().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }
  loadDiscountById(id: string): void {
    this.isLoading = true;

    this.discountService.getDiscountById(id).subscribe({
      next: (discount) => {
        this.discountForm.patchValue({
          name: discount.name,
          description: discount.description ?? '',
          percentage: discount.percentage,
          isActive: discount.isActive,
          startDate: this.toInputDate(discount.startDate),
          endDate: this.toInputDate(discount.endDate),
          productIds: discount.productIds ?? []
        });

        this.applyProductFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load discount', err);
        this.isLoading = false;
      }
    });
  }
  get selectedProductIds(): number[] {
    return this.discountForm.get('productIds')?.value || [];
  }

  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }

  toggleProductSelection(productId: number): void {
    const current = [...this.selectedProductIds];
    const index = current.indexOf(productId);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(productId);
    }

    this.discountForm.get('productIds')?.setValue(current);
    this.discountForm.get('productIds')?.markAsTouched();
  }

  isAllFilteredSelected(): boolean {
    if (this.filteredProducts.length === 0) return false;
    return this.filteredProducts.every(p => this.selectedProductIds.includes(p.id));
  }

  toggleSelectAllFiltered(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = [...this.selectedProductIds];
    const filteredIds = this.filteredProducts.map(p => p.id);

    let updated: number[];

    if (checked) {
      updated = [...new Set([...current, ...filteredIds])];
    } else {
      updated = current.filter(id => !filteredIds.includes(id));
    }

    this.discountForm.get('productIds')?.setValue(updated);
    this.discountForm.get('productIds')?.markAsTouched();
  }

  onSearchProducts(event: Event): void {
    this.productSearchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyProductFilters();
  }

  onCategoryFilter(event: Event): void {
    this.selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.applyProductFilters();
  }

  applyProductFilters(): void {
    let result = [...this.products];

    if (this.selectedCategoryId !== 'all') {
      result = result.filter(p => p.categoryId == Number(this.selectedCategoryId));
    }

    if (this.productSearchTerm) {
      result = result.filter(p =>
        p.name?.toLowerCase().includes(this.productSearchTerm)
      );
    }

    this.filteredProducts = result;
  }

  getProductPreviewImage(product: any): string {
    if (product.images && product.images.length > 0) {
      return this.global.getImageUrl(product.images[0].imageUrl);
    }
    return 'assets/no-image.png';
  }

  getSelectedProductsCount(): number {
    return this.selectedProductIds.length;
  }

  onSubmit(): void {
    if (this.discountForm.invalid) {
      this.discountForm.markAllAsTouched();
      return;
    }

    const payload: ICreateDiscount = {
      name: this.discountForm.value.name,
      description: this.discountForm.value.description,
      percentage: Number(this.discountForm.value.percentage),
      isActive: this.discountForm.value.isActive,
      startDate: this.discountForm.value.startDate,
      endDate: this.discountForm.value.endDate,
      productIds: this.selectedProductIds
    };

    if (this.isEditMode && this.discountId) {
      this.discountService.updateDiscount(this.discountId, payload).subscribe({
        next: (res) => {
          alert(res.message);
        },
        error: (err) => {
          console.error('Update failed', err);
          alert(err?.error?.message || 'Failed to update discount.');
        }
      });
    } else {
      this.discountService.createDiscount(payload).subscribe({
        next: (res) => {
          alert(res.message);
        },
        error: (err) => {
          console.error('Create failed', err);
          alert(err?.error?.message || 'Failed to create discount.');
        }
      });
    }
    this.router.navigate(['/manage/discounts']);

  }

  goBack(): void {
    this.location.back();
  }

  private toInputDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}