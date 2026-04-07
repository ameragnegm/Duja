import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
let Login = class Login {
    fb;
    auth;
    router;
    isLoading = false;
    errorMsg = '';
    successMsg = '';
    Form;
    constructor(fb, auth, router) {
        this.fb = fb;
        this.auth = auth;
        this.router = router;
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
        this.auth.login(this.Form.value).subscribe({
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
};
Login = __decorate([
    Component({
        selector: 'app-login',
        imports: [ReactiveFormsModule, RouterLink],
        templateUrl: './login.html',
        styleUrl: './login.css'
    })
], Login);
export { Login };
