import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IRegister } from '../models/Auth/register.model';
import { ILogin } from '../models/Auth/login.model';
import { ApiResponce } from '../models/Product/ApiResponce.model';
import { IAuthResponse } from '../models/Auth/AuthResponse.model';
import { ILoginedUser } from '../models/Auth/logineduser.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Auth`;
  private TOKEN_KEY = 'duja_token';
  private USER_KEY = 'duja_user';
  private userSubject = new BehaviorSubject<ILoginedUser | null>(this.getUser());

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }
  getUser(): ILoginedUser | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }
  register(SignUpData: IRegister): Observable<ApiResponce> {
    return this.http.post<ApiResponce>(`${this.baseUrl}/register`, SignUpData);
  } login(data: ILogin): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);

        const user: ILoginedUser = {
          userId: res.userId,
          token: res.token,
          userName: res.userName,
          email: res.email,
          roles: res.roles
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }
 isLoggedIn(): boolean {
    return !!this.getUser()?.token;
  }

  hasRole(role: string): boolean {
    return this.getUser()?.roles?.includes(role) ?? false;
  }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }
}
