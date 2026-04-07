import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
let SignUp = class SignUp {
    fb;
    auth;
    router;
    isLoading = false;
    errorMsg = '';
    successMsg = '';
    form;
    constructor(fb, auth, router) {
        this.fb = fb;
        this.auth = auth;
        this.router = router;
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
        const payload = this.form.value;
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
};
SignUp = __decorate([
    Component({
        selector: 'app-sign-up',
        imports: [ReactiveFormsModule, RouterLink],
        templateUrl: './sign-up.html',
        styleUrl: './sign-up.css'
    })
], SignUp);
export { SignUp };
