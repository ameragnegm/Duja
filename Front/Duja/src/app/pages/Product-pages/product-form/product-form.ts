import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../services/product-service';
import { SizeService } from '../../../services/size-service';
import { ColorService } from '../../../services/color-service';
import { CategoryService } from '../../../services/category-service';

import { IProduct } from '../../../models/Product/product.model';
import { Isize } from '../../../models/Sizes/size.model';
import { Global } from '../../../shared/global';
import { ApiResponce } from '../../../models/Product/ApiResponce.model';
import { Icolor } from '../../../models/Colors/color.model';
import { Icategory } from '../../../models/Categories/category.model';
import { Categorycrudmanage } from "../../../components/categorycrudmanage/categorycrudmanage";
import { Sizecrudmanage } from "../../../components/sizecrudmanage/sizecrudmanage";
import { Colorcrudmanage } from "../../../components/colorcrudmanage/colorcrudmanage";

interface ImagePreview {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Categorycrudmanage, Sizecrudmanage, Colorcrudmanage],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  isEditMode = false;
  productform: FormGroup;
  productid: string | null = null;
  product!: IProduct;

  Categories: Icategory[] = [];
  sizes: Isize[] = [];
  colors: Icolor[] = [];
  responce!: ApiResponce;

  existingImages: any[] = [];
  imagesToDelete: number[] = [];
  newlySelectedImagePreviews: ImagePreview[] = [];

  categoryForm!: FormGroup;
  sizeForm!: FormGroup;
  colorForm!: FormGroup;

  editingCategoryId: number | null = null;
  editingSizeId: number | null = null;
  editingColorId: number | null = null;

  showCategoryManager = false;
  showSizeManager = false;
  showColorManager = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private productservice: ProductService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private categoryService: CategoryService,
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public global: Global
  ) {
    this.productform = this.formbuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required],
      variants: this.formbuilder.array([])
    });

    this.categoryForm = this.formbuilder.group({
      name: ['', Validators.required]
    });

    this.sizeForm = this.formbuilder.group({
      name: ['', Validators.required]
    });

    this.colorForm = this.formbuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productid = this.route.snapshot.paramMap.get('id');
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.productservice.getProductFormData(this.productid).subscribe({
      next: (data) => {
        this.Categories = data.categories;
        this.sizes = data.sizes;
        this.colors = data.colors;
        this.cdr.detectChanges();

        if (data.product && !this.isEditMode) {
          this.isEditMode = true;
          this.product = data.product;
          this.existingImages = this.product.images || [];
          this.productform.patchValue({
            name: this.product.name,
            description: this.product.description,
            price: this.product.price,
            categoryId: this.product.categoryId
          });

          if (this.product.variants && this.product.variants.length > 0) {
            const variantControls = this.product.variants.map((variant: any) =>
              this.createVariantGroup(variant)
            );
            this.productform.setControl('variants', this.formbuilder.array(variantControls));
          } else {
            this.addVariant();
          }
        } else if (!this.isEditMode && this.variants.length === 0) {
          this.addVariant();
        }
      },
      error: (err) => console.error('Failed to load form data', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getcategories().subscribe({
      next: (data) => {
        this.Categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to reload categories', err)
    });
  }

  loadSizes(): void {
    this.sizeService.getallSizes().subscribe({
      next: (data) => {
        this.sizes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to reload sizes', err)
    });
  }

  loadColors(): void {
    this.colorService.getallColors().subscribe({
      next: (data) => {
        this.colors = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to reload colors', err)
    });
  }

  get variants(): FormArray {
    return this.productform.get('variants') as FormArray;
  }

  createVariantGroup(variant: any = {}): FormGroup {
    return this.formbuilder.group({
      id: [variant.id ?? 0],
      sizeID: [variant.sizeID ?? null],
      colorID: [variant.colorID ?? null],
      stockQuantity: [variant.stockQuantity ?? null],

      length: [variant.length ?? null],
      shoulder: [variant.shoulder ?? null],
      bust: [variant.bust ?? null],
      sleevelength: [variant.sleevelength ?? null],
      waist: [variant.waist ?? null],
      hip: [variant.hip ?? null],
      inseam: [variant.inseam ?? null],
      thigh: [variant.thigh ?? null],
      weight: [variant.weight ?? null],
      note: [variant.note ?? null]
    });
  }

  openCategoryManager(): void {
    this.showCategoryManager = true;
  }

  closeCategoryManager(): void {
    this.showCategoryManager = false;
    this.loadCategories();
  }

  openSizeManager(): void {
    this.showSizeManager = true;
  }

  closeSizeManager(): void {
    this.showSizeManager = false;
    this.loadSizes();
  }

  openColorManager(): void {
    this.showColorManager = true;
  }

  closeColorManager(): void {
    this.showColorManager = false;
    this.loadColors();
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.newlySelectedImagePreviews.push({
          file,
          previewUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeNewImage(index: number): void {
    this.newlySelectedImagePreviews.splice(index, 1);
  }

  markImageForDeletion(imageId: number): void {
    if (!this.imagesToDelete.includes(imageId)) {
      this.imagesToDelete.push(imageId);
    }
    this.existingImages = this.existingImages.filter(img => img.id !== imageId);
  }

  private toNumberOrNull(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  private buildVariantsPayload(): any[] {
    return this.variants.controls.map(control => {
      const value = control.value;

      return {
        id: Number(value.id ?? 0),
        sizeID: this.toNumberOrNull(value.sizeID),
        colorID: this.toNumberOrNull(value.colorID),
        stockQuantity: this.toNumberOrNull(value.stockQuantity),

        length: this.toNumberOrNull(value.length),
        shoulder: this.toNumberOrNull(value.shoulder),
        bust: this.toNumberOrNull(value.bust),
        sleevelength: this.toNumberOrNull(value.sleevelength),
        waist: this.toNumberOrNull(value.waist),
        hip: this.toNumberOrNull(value.hip),
        inseam: this.toNumberOrNull(value.inseam),
        thigh: this.toNumberOrNull(value.thigh),
        weight: this.toNumberOrNull(value.weight),

        note: value.note ?? null
      };
    });
  }
  private buildFormData(): FormData {
    const formData = new FormData();

    formData.append('Name', this.productform.get('name')?.value ?? '');
    formData.append('Description', this.productform.get('description')?.value ?? '');
    formData.append('Price', String(this.productform.get('price')?.value ?? 0));

    const categoryId = this.productform.get('categoryId')?.value;
    if (categoryId !== null && categoryId !== undefined && categoryId !== '') {
      formData.append('CategoryId', String(categoryId));
    }

    const variantsPayload = this.buildVariantsPayload();
    formData.append('VariantsINJSON', JSON.stringify(variantsPayload));

    this.imagesToDelete.forEach(id => {
      formData.append('ImagesToDelete', id.toString());
    });

    this.newlySelectedImagePreviews.forEach(imgPreview => {
      formData.append('NewImages', imgPreview.file, imgPreview.file.name);
    });

    return formData;
  }

  onSubmit(): void {
    if (this.existingImages.length === 0 && this.newlySelectedImagePreviews.length === 0) {
      alert('You must have at least one image for the product.');
      return;
    }

    if (this.productform.invalid) {
      alert('Form is invalid! Please check all required fields.');
      this.productform.markAllAsTouched();
      return;
    }

    const formData = this.buildFormData();

    if (this.isEditMode) {
      this.productservice.UpdateProductDb(String(this.product.id), formData).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/product', this.product.id]);
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Update failed. Check console for details.');
        }
      });
    } else {
      this.productservice.AddproductDb(formData).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.router.navigate(['/manage/products']);
        },
        error: (err) => {
          console.error('Add failed', err);
          alert('Failed to add product. Check console for details.');
        }
      });
    }
  }

  goBack(): void {
    this.global.goBack();
  }
}