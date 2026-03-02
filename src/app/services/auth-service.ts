import {Injectable, inject, PLATFORM_ID, signal} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {TokenService} from './token-service';
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

interface LoginResponse {
  success: boolean;
  data: { user: User; accessToken: string };
}
interface RefreshResponse {
  success: boolean;
  data: { accessToken: string };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private http = inject(HttpClient);
  // private router = inject(Router);
  // private platformId = inject(PLATFORM_ID);
  //
  // baseApiUrl = environment.apiBaseUrl;
  // private readonly ACCESS_TOKEN_KEY = 'accessToken';
  // private readonly USER_KEY = 'currentUser';
  //
  // private currentUserSubject = new BehaviorSubject<any | null>(null);
  // public currentUser$ = this.currentUserSubject.asObservable();
  //
  // public isRefreshing = false;
  //
  // constructor() {
  //   // Load user and token from storage on initialization (only in browser)
  //   if (this.isBrowser()) {
  //     const token = this.getAccessToken();
  //     const user = this.getCurrentUser();
  //     if (token && user) {
  //       this.currentUserSubject.next(user);
  //     }
  //   }
  // }
  //
  // setAccessToken(token: string): void {
  //   if (this.isBrowser()) {
  //     localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  //   }
  // }
  //
  // getAccessToken(): string | null {
  //   if (!this.isBrowser()) {
  //     return null;
  //   }
  //   return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  // }
  //
  // getCurrentUser(): any | null {
  //   if (!this.isBrowser()) {
  //     return null;
  //   }
  //   const userJson = localStorage.getItem(this.USER_KEY);
  //   if (userJson) {
  //     try {
  //       return JSON.parse(userJson);
  //     } catch {
  //       return null;
  //     }
  //   }
  //   return null;
  // }
  //
  // private setCurrentUser(user: any): void {
  //   if (this.isBrowser()) {
  //     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  //     this.currentUserSubject.next(user);
  //   }
  // }
  //
  // clear(): void {
  //   if (this.isBrowser()) {
  //     localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  //     localStorage.removeItem(this.USER_KEY);
  //   }
  //   this.currentUserSubject.next(null);
  // }
  //
  // isAuthenticated(): boolean {
  //   return !!this.getAccessToken();
  // }
  //
  // signUp(signUpFrom: any): Observable<any> {
  //   return this.http.post(this.baseApiUrl + 'auth/register', signUpFrom);
  // }
  //
  // login(loginFrom: any): Observable<any> {
  //   return this.http.post<any>(
  //     this.baseApiUrl + 'auth/login',
  //     loginFrom,
  //     { withCredentials: true } // Important for refresh token cookie
  //   ).pipe(
  //     tap(response => {
  //       if (response.success) {
  //         this.setAccessToken(response.data.accessToken);
  //         this.setCurrentUser(response.data.user);
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('Login error:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  //
  // refreshToken(): Observable<any> {
  //   if (this.isRefreshing) {
  //     return throwError(() => new Error('Already refreshing'));
  //   }
  //
  //   this.isRefreshing = true;
  //
  //   return this.http.post<any>(
  //     this.baseApiUrl + 'auth/refresh',
  //     null,
  //     { withCredentials: true }
  //   ).pipe(
  //     tap(response => {
  //       if (response.success) {
  //         this.setAccessToken(response.data.accessToken);
  //       }
  //       this.isRefreshing = false;
  //     }),
  //     catchError(error => {
  //       this.isRefreshing = false;
  //       this.clear();
  //       this.router.navigate(['/login']);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  //
  // verifyEmail(token: string): Observable<any> {
  //   return this.http.post(this.baseApiUrl + 'auth/verify-email', {
  //     token
  //   });
  // }
  //
  // loginGmail(): Observable<any> {
  //   return this.http.post(this.baseApiUrl + 'auth/login-gmail', {});
  // }
  //
  // logout(): Observable<any> {
  //   const token = this.getAccessToken();
  //
  //   if (!token) {
  //     this.clear();
  //     this.router.navigate(['/login']);
  //     return throwError(() => new Error('No token found'));
  //   }
  //
  //   const logoutHeader = new HttpHeaders({
  //     Authorization: 'Bearer ' + token,
  //   });
  //
  //   return this.http.post(
  //     `${this.baseApiUrl}auth/logout`,
  //     {},
  //     {
  //       headers: logoutHeader,
  //       withCredentials: true
  //     }
  //   ).pipe(
  //     tap(() => {
  //       this.clear();
  //       this.router.navigate(['/login']);
  //     }),
  //     catchError(error => {
  //       // Clear data even if logout fails
  //       this.clear();
  //       this.router.navigate(['/login']);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  //
  // private isBrowser(): boolean {
  //   return isPlatformBrowser(this.platformId);
  // }

  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly API = environment.apiBaseUrl+'auth';
  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

  login(loginForm:any): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, loginForm, {
      withCredentials: true  // ← required to receive httpOnly cookie
    }).pipe(
      tap(res => {
        this.tokenService.setToken(res.data.accessToken);
        this.currentUser.set(res.data.user);
        this.isLoggedIn.set(true);
      })
    );
  }

  refresh(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.API}/refresh`, null, {
      withCredentials: true
    }).pipe(
      tap(res => {
        this.tokenService.setToken(res.data.accessToken);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }
  logout(): void {
    this.http.post(`${this.API}/logout`, {}, { withCredentials: true }).subscribe();
    this.tokenService.clearToken();
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

}
