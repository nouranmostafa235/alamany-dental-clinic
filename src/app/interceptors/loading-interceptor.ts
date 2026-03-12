// import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { finalize, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
// import { LoadingService } from '../services/loading-service';
// import { AuthService } from '../services/auth-service';
// import { Router } from '@angular/router';
//
// let isRefreshing = false;
// const refreshSubject = new BehaviorSubject<string | null>(null);
//
// export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
//   const loading = inject(LoadingService);
//   const platformId = inject(PLATFORM_ID);
//   const auth = inject(AuthService);
//   const router = inject(Router);
//
//   const isBrowser = isPlatformBrowser(platformId);
//
//   // Show loader only in browser
//   if (isBrowser) {
//     loading.show();
//   }
//   const isAuthEndpoint = req.url.includes('/auth/login') ||
//     req.url.includes('/auth/refresh') ||
//     req.url.includes('/auth/logout') ||
//     req.url.includes('/auth/register');
//   // Clone request with credentials
//   let authReq = req.clone({ withCredentials: true });
//
//   // Attach token if exists and not login/refresh endpoints
//   const token = auth.getAccessToken();
//   if (token && token && !isAuthEndpoint) {
//     authReq = authReq.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//   }
//
//   return next(authReq).pipe(
//     catchError((err: HttpErrorResponse) => {
//       // Handle 401 unauthorized - token expired
//       if ((err.status === 401 || err.error.message === 'Access token expired') && isBrowser
//         && !req.url.includes('/auth/refresh')) {
//
//         // First request triggers refresh
//         if (!isRefreshing) {
//           isRefreshing = true;
//           refreshSubject.next(null);
//
//           return auth.refreshToken().pipe(
//             switchMap(res => {
//               const newToken = res.data.accessToken;
//               isRefreshing = false;
//               refreshSubject.next(newToken);
//
//               // Retry original request with new token
//               const retryReq = authReq.clone({
//                 setHeaders: { Authorization: `Bearer ${newToken}` }
//               });
//               return next(retryReq);
//             }),
//             catchError(refreshErr => {
//               isRefreshing = false;
//               refreshSubject.next(null);
//               auth.clear();
//               router.navigate(['/login']);
//               return throwError(() => refreshErr);
//             })
//           );
//         }
//
//         // Subsequent requests wait for refresh to complete
//         return refreshSubject.pipe(
//           filter(token => token !== null),
//           take(1),
//           switchMap(newToken => {
//             const retryReq = authReq.clone({
//               setHeaders: { Authorization: `Bearer ${newToken}` }
//             });
//             return next(retryReq);
//           })
//         );
//       }
//
//       return throwError(() => err);
//     }),
//     finalize(() => {
//       if (isBrowser) {
//         loading.hide();
//       }
//     })
//   );
// };
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize} from 'rxjs';
import {TokenService} from '../services/token-service';
import {AuthService} from '../services/auth-service';
import {LoadingService} from '../services/loading-service';
import {tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const toaster = inject(ToastrService)
  const authService = inject(AuthService);
  const loading = inject(LoadingService);
  const token = tokenService.getToken();
  const authReq = token ? addToken(req, token) : req;
  const skipLoadingUrls = ['/auth/login'];
  const shouldShowLoading = !skipLoadingUrls.some(url => req.url.includes(url));

  if (shouldShowLoading) loading.show();
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      handleErrorToast(error,toaster)
      // Don't retry refresh/login/logout endpoints
      if (error.status !== 401  || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return refreshSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token => next(addToken(req, token!)))
        );
      }

      isRefreshing = true;
      refreshSubject.next(null);

      // return authService.refresh().pipe(
      //   switchMap(res => {
      //     isRefreshing = false;
      //     refreshSubject.next(res.data.accessToken);
      //     return next(addToken(req, res.data.accessToken));
      //   }),
      //   catchError(err => {
      //     isRefreshing = false;
      //     return throwError(() => err);
      //   })
      // );
      return authService.refresh().pipe(
        switchMap(res => {
          const newToken = res.data.accessToken;
          isRefreshing = false;
          refreshSubject.next(newToken);
          return next(addToken(req, newToken));
        }),
        catchError(err => {
          isRefreshing = false;
          refreshSubject.next(null);

          // refresh token expired
          // tokenService.clear();
          authService.logout(); // أو router.navigate(['/login'])

          return throwError(() => err);
        })
      );
    }),
    finalize(() => {
      if (shouldShowLoading) loading.hide();
    })
  );

};
function handleErrorToast(error: HttpErrorResponse, toastr: ToastrService) {
  const backendMessage = error.error?.message || error.error?.error || null;

  switch (error.status) {
    case 400:
      toastr.error(backendMessage || 'Bad request. Please check your input.', 'Error');
      break;
    case 401:
      toastr.warning(backendMessage || 'Session expired. Please log in again.', 'Unauthorized');
      break;
    case 403:
      toastr.error(backendMessage || 'You do not have permission to do this.', 'Forbidden');
      break;
    case 404:
      toastr.error(backendMessage || 'Resource not found.', 'Not Found');
      break;
    case 422:
      toastr.error(backendMessage || 'Validation failed. Please check your input.', 'Validation Error');
      break;
    case 500:
      toastr.error(backendMessage || 'Server error. Please try again later.', 'Server Error');
      break;
    case 0:
      toastr.error('No internet connection or server is unreachable.', 'Network Error');
      break;
    default:
      toastr.error(backendMessage || 'Something went wrong.', 'Error');
  }

}

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
