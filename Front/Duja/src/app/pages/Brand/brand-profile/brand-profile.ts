import { BrandInfoService } from './../../../services/brand-info-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandInfo } from '../../../models/BrandInfo.model';

@Component({
  selector: 'app-brand-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-profile.html',
  styleUrls: ['./brand-profile.css']
})
export class BrandProfile implements OnInit {
  brandForm!: FormGroup;
  brandInfo: BrandInfo | null = null;

  isLoading = true;
  isSaving = false;
  isEditMode = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private brandInfoService: BrandInfoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBrandInfo();
  }

  initForm(): void {
    this.brandForm = this.fb.group({
      brandName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(150)]],
      description: [{ value: '', disabled: true }, [Validators.maxLength(500)]],
      phone: [{ value: '', disabled: true }, [Validators.maxLength(100)]],
      whatsApp: [{ value: '', disabled: true }, [Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.email, Validators.maxLength(150)]],
      instagramUrl: [{ value: '', disabled: true }, [Validators.maxLength(200)]],
      tikTokUrl: [{ value: '', disabled: true }, [Validators.maxLength(200)]]
    });
  }

  loadBrandInfo(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.brandInfoService.getBrandInfo().subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.brandInfo = data;
          this.brandForm.patchValue(data);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
        queueMicrotask(() => {
          this.errorMessage = 'Failed to load brand information.';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.brandForm.enable();
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.brandInfo) {
      this.brandForm.patchValue(this.brandInfo);
    }

    this.brandForm.disable();
  }

  saveChanges(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updatedBrand: BrandInfo = this.brandForm.getRawValue();

    this.brandInfoService.updateInfo(updatedBrand).subscribe({
      next: (res) => {
        this.brandInfo = updatedBrand;
        this.isSaving = false;
        this.isEditMode = false;
        this.brandForm.disable();
        this.successMessage = res.message || 'Brand info updated successfully.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.errorMessage = 'Failed to update brand information.';
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.brandForm.controls;
  }
}