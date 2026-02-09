import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth-service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);

  // Allow access during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Check if user is authenticated
  if (auth.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
