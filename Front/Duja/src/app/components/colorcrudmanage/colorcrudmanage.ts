import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorService } from '../../services/color-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colorcrudmanage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './colorcrudmanage.html',
  styleUrl: './colorcrudmanage.css'
})
export class Colorcrudmanage {
  @Output() closed = new EventEmitter<void>();

  colors: any[] = [];
  form: FormGroup;
  editingId: number | null = null;

  isLoading = false;
  hasLoaded = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private colorService: ColorService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.isLoading = true;
    this.hasLoaded = false;
    this.errorMessage = '';

    this.colorService.getallColors().subscribe({
      next: (res) => {
        console.log('colors response:', res);
        this.colors = res || [];
        this.isLoading = false;
        this.hasLoaded = true;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading colors:', err);
        this.colors = [];
        this.errorMessage = 'Failed to load colors.';
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

    const payload = {
      name: this.form.value.name.trim()
    };

    if (this.editingId) {
      this.colorService.updateColor(this.editingId, payload).subscribe({
        next: () => {
          this.loadColors();
          this.resetForm();
        }
      });
    } else {
      this.colorService.addColor(payload).subscribe({
        next: () => {
          this.loadColors();
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
    const confirmed = confirm('Delete this color?');
    if (!confirmed) return;

    this.colorService.deleteColor(id).subscribe({
      next: () => {
        this.loadColors();
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
