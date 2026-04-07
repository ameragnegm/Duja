import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorycrudmanage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorycrudmanage.html',
  styleUrl: './categorycrudmanage.css'
})
export class Categorycrudmanage implements OnInit {
  @Output() closed = new EventEmitter<void>();

  categories: any[] = [];
  form: FormGroup;
  editingId: number | null = null;
  isLoading = false;
  hasLoaded = false;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.cdr.detectChanges();
  }
  loadCategories(): void {
    this.isLoading = true;
    this.hasLoaded = false;

    this.categoryService.getcategories().subscribe({
      next: (res) => {
        this.categories = res || [];
        this.isLoading = false;
        this.hasLoaded = true;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = [];
        this.isLoading = false;
        this.hasLoaded = true;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { name: this.form.value.name.trim() };

    if (this.editingId) {
      this.categoryService.updateCategory(this.editingId, payload).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
        }
      });
    } else {
      this.categoryService.addCategory(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
        }
      });
    }
  }

  edit(item: any): void {
    this.editingId = item.id;
    this.form.patchValue({
      name: item.name
    });
  }

  delete(id: number): void {
    const confirmed = confirm('Delete this category?');
    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        if (this.editingId === id) {
          this.resetForm();
        }
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ name: '' });
  }

  close(): void {
    this.closed.emit();
  }
}
