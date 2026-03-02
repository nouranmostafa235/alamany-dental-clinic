import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly platformId = inject(PLATFORM_ID);

  // In-memory fallback for SSR
  private memoryToken: string | null = null;

  setToken(token: string): void {
    this.memoryToken = token;
    if (isPlatformBrowser(this.platformId)) {
      // Use sessionStorage (tab-scoped) — NOT localStorage (XSS risk)
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.TOKEN_KEY) ?? this.memoryToken;
    }
    return this.memoryToken;
  }

  clearToken(): void {
    this.memoryToken = null;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
