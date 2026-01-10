import { HttpInterceptorFn } from '@angular/common/http';
import {LoadingService} from '../services/loading-service';
import {PLATFORM_ID,inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {finalize} from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn =
  (req, next) => {
    const loading = inject(LoadingService);
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      loading.show();
    }
    return next(req).pipe(
      finalize(() => {
        if (isPlatformBrowser(platformId)) {
          loading.hide();
        }
      })
    );
};
