import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
let AuthService = class AuthService {
    http;
    baseUrl = `${environment.apiUrl}/Auth`;
    TOKEN_KEY = 'duja_token';
    USER_KEY = 'duja_user';
    userSubject = new BehaviorSubject(this.getUser());
    user$ = this.userSubject.asObservable();
    constructor(http) {
        this.http = http;
    }
    getUser() {
        const u = localStorage.getItem(this.USER_KEY);
        return u ? JSON.parse(u) : null;
    }
    register(SignUpData) {
        return this.http.post(`${this.baseUrl}/register`, SignUpData);
    }
    login(data) {
        return this.http.post(`${this.baseUrl}/login`, data).pipe(tap(res => {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            const user = {
                userId: res.userId,
                token: res.token,
                userName: res.userName,
                email: res.email,
                roles: res.roles
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.userSubject.next(user);
        }));
    }
    isLoggedIn() {
        return !!this.getUser()?.token;
    }
    hasRole(role) {
        return this.getUser()?.roles?.includes(role) ?? false;
    }
    logout() {
        localStorage.clear();
        this.userSubject.next(null);
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
