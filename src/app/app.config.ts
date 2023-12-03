import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient,  withFetch, withInterceptors } from '@angular/common/http';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { authInterceptor } from './shared/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(),  withInterceptors([authInterceptor])),
    provideAnimations(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false,
    })
  ],
};
