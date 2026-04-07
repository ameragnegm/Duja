import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeService } from '../../services/size-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sizecrudmanage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sizecrudmanage.html',
  styleUrl: './sizecrudmanage.css'
})
export class Sizecrudmanage {
  @Output() closed = new EventEmitter<void>();

  sizes: any[] = [];
  form: FormGroup;
  editingId: number | null = null;

  isLoading = false;
  hasLoaded = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private sizeService: SizeService,
    private cdr: ChangeDetectorRef

  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadSizes();
  }

  loadSizes(): void {
    this.isLoading = true;
    this.hasLoaded = false;
    this.errorMessage = '';

    this.sizeService.getallSizes().subscribe({
      next: (res) => {
        console.log('sizes response:', res);
        this.sizes = res || [];
        this.isLoading = false;
        this.hasLoaded = true;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading sizes:', err);
        this.sizes = [];
        this.errorMessage = 'Failed to load sizes.';
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
      this.sizeService.updateSize(this.editingId, payload).subscribe({
        next: () => {
          this.loadSizes();
          this.resetForm();
        }
      });
    } else {
      this.sizeService.addSize(payload).subscribe({
        next: () => {
          this.loadSizes();
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
    const confirmed = confirm('Delete this size?');
    if (!confirmed) return;

    this.sizeService.deleteSize(id).subscribe({
      next: () => {
        this.loadSizes();
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
