import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { IRegister } from '../../../models/Auth/register.model';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
 isLoading = false;
  errorMsg = '';
  successMsg = '';
  form !:FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  }

  submit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as IRegister;

    this.isLoading = true;
    this.auth.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = 'Account created successfully ✅';
        // go login page after 1 second
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.isLoading = false;

        // ✅ show backend error message if exists
        this.errorMsg =
          err?.error?.message ||
          err?.error ||
          'Register failed. Please try again.';
      },
    });
  }
}
