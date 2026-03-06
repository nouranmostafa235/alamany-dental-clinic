import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideToastr} from 'ngx-toastr';
import {authInterceptor} from './interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ]
};
