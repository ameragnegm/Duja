import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
let ProductForm = class ProductForm {
    cdr;
    productservice;
    sizeService;
    colorService;
    categoryService;
    formbuilder;
    route;
    router;
    global;
    isEditMode = false;
    productform;
    productid = null;
    product;
    Categories = [];
    sizes = [];
    colors = [];
    responce;
    // --- IMAGE STATE ---
    existingImages = [];
    imagesToDelete = [];
    newlySelectedImagePreviews = [];
    // --- CATEGORY, SIZE & COLOR STATE ---
    categoryForm;
    sizeForm;
    colorForm;
    editingCategoryId = null;
    editingSizeId = null;
    editingColorId = null;
    constructor(cdr, productservice, sizeService, colorService, categoryService, // <-- NEW INJECTION
    formbuilder, route, router, global) {
        this.cdr = cdr;
        this.productservice = productservice;
        this.sizeService = sizeService;
        this.colorService = colorService;
        this.categoryService = categoryService;
        this.formbuilder = formbuilder;
        this.route = route;
        this.router = router;
        this.global = global;
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
    ngOnInit() {
        this.productid = this.route.snapshot.paramMap.get('id');
        this.loadInitialData();
    }
    // --- DATA LOADING ---
    loadInitialData() {
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
                    this.productform.patchValue(this.product);
                    if (this.product.variants && this.product.variants.length > 0) {
                        const variantControls = this.product.variants.map(variant => this.createVariantGroup(variant));
                        this.productform.setControl('variants', this.formbuilder.array(variantControls));
                    }
                }
            },
            error: (err) => console.error("Failed to load form data", err)
        });
    }
    loadCategories() {
        this.categoryService.getcategories().subscribe({
            next: (data) => {
                this.Categories = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error("Failed to reload categories", err)
        });
    }
    loadSizes() {
        this.sizeService.getallSizes().subscribe({
            next: (data) => {
                this.sizes = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error("Failed to reload sizes", err)
        });
    }
    loadColors() {
        this.colorService.getallColors().subscribe({
            next: (data) => {
                this.colors = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error("Failed to reload colors", err)
        });
    }
    // --- VARIANT MANAGEMENT ---
    get variants() {
        return this.productform.get('variants');
    }
    createVariantGroup(variant = {}) {
        return this.formbuilder.group({
            id: [variant.id || 0],
            sizeID: [variant.sizeID || null, Validators.required],
            colorID: [variant.colorID || null, Validators.required],
            stockQuantity: [variant.stockQuantity || 0, Validators.required],
            length: [variant.length || 0],
            width: [variant.width || 0]
        });
    }
    addVariant() {
        this.variants.push(this.createVariantGroup());
    }
    removeVariant(varientIndex) {
        this.variants.removeAt(varientIndex);
    }
    // --- CATEGORY MANAGEMENT METHODS ---
    saveCategory() {
        if (this.categoryForm.invalid)
            return;
        const newCategory = { name: this.categoryForm.value.name };
        this.categoryService.addCategory(newCategory).subscribe({
            next: () => {
                this.categoryForm.reset();
                this.loadCategories();
            },
            error: (err) => console.error("Add category error:", err)
        });
    }
    startEditCategory(id) { this.editingCategoryId = id; }
    cancelEditCategory() {
        this.editingCategoryId = null;
        this.loadCategories();
    }
    updateCategory(category) {
        const payload = { name: category.name };
        this.categoryService.updateCategory(category.id, payload).subscribe({
            next: () => {
                this.editingCategoryId = null;
                this.loadCategories();
            },
            error: (err) => console.error("Update category error:", err)
        });
    }
    deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => {
                    // If the user deletes the currently selected category in the main form, clear the selection
                    if (this.productform.get('categoryId')?.value === id) {
                        this.productform.get('categoryId')?.setValue(null);
                    }
                    this.loadCategories();
                },
                error: (err) => console.error("Delete category error:", err)
            });
        }
    }
    // --- SIZE MANAGEMENT METHODS ---
    saveSize() {
        if (this.sizeForm.invalid)
            return;
        const newSize = { name: this.sizeForm.value.name };
        this.sizeService.addSize(newSize).subscribe({
            next: () => {
                this.sizeForm.reset();
                this.loadSizes();
            },
            error: (err) => console.error("Add size error:", err)
        });
    }
    startEditSize(id) { this.editingSizeId = id; }
    cancelEditSize() {
        this.editingSizeId = null;
        this.loadSizes();
    }
    updateSize(size) {
        const payload = { name: size.name };
        this.sizeService.updateSize(size.id, payload).subscribe({
            next: () => {
                this.editingSizeId = null;
                this.loadSizes();
            },
            error: (err) => console.error("Update size error:", err)
        });
    }
    deleteSize(id) {
        if (confirm('Are you sure you want to delete this size?')) {
            this.sizeService.deleteSize(id).subscribe({
                next: () => this.loadSizes(),
                error: (err) => console.error("Delete size error:", err)
            });
        }
    }
    // --- COLOR MANAGEMENT METHODS ---
    saveColor() {
        if (this.colorForm.invalid)
            return;
        const newColor = { name: this.colorForm.value.name };
        this.colorService.addColor(newColor).subscribe({
            next: () => {
                this.colorForm.reset();
                this.loadColors();
            },
            error: (err) => console.error("Add color error:", err)
        });
    }
    startEditColor(id) { this.editingColorId = id; }
    cancelEditColor() {
        this.editingColorId = null;
        this.loadColors();
    }
    updateColor(color) {
        const payload = { name: color.name };
        this.colorService.updateColor(color.id, payload).subscribe({
            next: () => {
                this.editingColorId = null;
                this.loadColors();
            },
            error: (err) => console.error("Update color error:", err)
        });
    }
    deleteColor(id) {
        if (confirm('Are you sure you want to delete this color?')) {
            this.colorService.deleteColor(id).subscribe({
                next: () => this.loadColors(),
                error: (err) => console.error("Delete color error:", err)
            });
        }
    }
    // --- IMAGE MANAGEMENT METHODS ---
    onFileSelected(event) {
        const files = Array.from(event.target.files);
        this.newlySelectedImagePreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                this.newlySelectedImagePreviews.push({
                    file: file,
                    previewUrl: reader.result
                });
            };
            reader.readAsDataURL(file);
        });
    }
    removeNewImage(index) {
        this.newlySelectedImagePreviews.splice(index, 1);
    }
    markImageForDeletion(imageId) {
        this.imagesToDelete.push(imageId);
        this.existingImages = this.existingImages.filter(img => img.id !== imageId);
    }
    // --- FORM SUBMISSION ---
    onSubmit() {
        if (this.existingImages.length === 0 && this.newlySelectedImagePreviews.length === 0) {
            alert("You must have at least one image for the product.");
            return;
        }
        if (this.productform.invalid) {
            alert("Form is invalid! Please check all required fields.");
            this.productform.markAllAsTouched();
            return;
        }
        const formData = new FormData();
        formData.append('Name', this.productform.get('name')?.value);
        formData.append('Description', this.productform.get('description')?.value);
        formData.append('Price', this.productform.get('price')?.value);
        formData.append('CategoryId', this.productform.get('categoryId')?.value);
        const variantsArray = this.productform.get('variants');
        variantsArray.controls.forEach((variantGroup, index) => {
            formData.append(`Variants[${index}].ID`, variantGroup.get('id')?.value);
            formData.append(`Variants[${index}].SizeId`, variantGroup.get('sizeID')?.value);
            formData.append(`Variants[${index}].ColorId`, variantGroup.get('colorID')?.value);
            formData.append(`Variants[${index}].StockQuantity`, variantGroup.get('stockQuantity')?.value);
            formData.append(`Variants[${index}].Length`, variantGroup.get('length')?.value);
            formData.append(`Variants[${index}].Width`, variantGroup.get('width')?.value);
        });
        this.imagesToDelete.forEach(id => formData.append('ImagesToDelete', id.toString()));
        this.newlySelectedImagePreviews.forEach(imgPreview => {
            formData.append('NewImages', imgPreview.file, imgPreview.file.name);
        });
        if (this.isEditMode) {
            this.productservice.UpdateProductDb(String(this.product.id), formData).subscribe({
                next: (data) => {
                    alert("Product updated successfully!");
                    this.router.navigate(['/product', this.product.id]);
                },
                error: (err) => {
                    console.error("Update failed", err);
                    alert("Update failed. Check console for details.");
                }
            });
        }
        else {
            this.productservice.AddproductDb(formData).subscribe({
                next: (data) => {
                    alert("Product added successfully!");
                    this.router.navigate(['/product']);
                },
                error: (err) => {
                    console.error("Add failed", err);
                    alert("Failed to add product. Check console for details.");
                }
            });
        }
    }
    goBack() {
        this.global.goBack();
    }
};
ProductForm = __decorate([
    Component({
        selector: 'app-product-form',
        standalone: true,
        imports: [ReactiveFormsModule, CommonModule, FormsModule],
        templateUrl: './product-form.html',
        styleUrl: './product-form.css'
    })
], ProductForm);
export { ProductForm };
