import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { LoadingService } from '../services/loading-service';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);

  // Show loader only in browser
  if (isBrowser) {
    loading.show();
  }

  // Clone request with credentials
  let authReq = req.clone({ withCredentials: true });

  // Attach token if exists and not login/refresh endpoints
  const token = auth.getAccessToken();
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Handle 401 unauthorized - token expired
      if (err.status === 401 && isBrowser && !req.url.includes('/auth/refresh')) {

        // First request triggers refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);

          return auth.refreshToken().pipe(
            switchMap(res => {
              const newToken = res.data.accessToken;
              isRefreshing = false;
              refreshSubject.next(newToken);

              // Retry original request with new token
              const retryReq = authReq.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            }),
            catchError(refreshErr => {
              isRefreshing = false;
              refreshSubject.next(null);
              auth.clear();
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        }

        // Subsequent requests wait for refresh to complete
        return refreshSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(newToken => {
            const retryReq = authReq.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryReq);
          })
        );
      }

      return throwError(() => err);
    }),
    finalize(() => {
      if (isBrowser) {
        loading.hide();
      }
    })
  );
};
