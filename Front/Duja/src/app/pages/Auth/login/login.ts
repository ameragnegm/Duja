import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../../models/Auth/login.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
 isLoading = false;
  errorMsg = '';
  successMsg = '';
  Form !: FormGroup ; 

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    
  this.Form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  }

  submit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.auth.login(this.Form.value as ILogin).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = res.message;

        setTimeout(() => this.router.navigate(['/home']), 500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Login failed. Try again.';
      },
    });
  }
}
