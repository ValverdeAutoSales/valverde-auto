import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const ValverdePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf6f5', 100: '#f9e8e6', 200: '#f0cdc9',
      300: '#e3aaa5', 400: '#d28a85', 500: '#bd6f6f',
      600: '#a35858', 700: '#864647', 800: '#6e3a3b',
      900: '#5c3233', 950: '#331a1b'
    },
    colorScheme: {
      light: {
        primary: { color: '#bd6f6f', contrastColor: '#ffffff', hoverColor: '#a35858', activeColor: '#864647' },
        surface: { 0: '#ffffff', 50: '#fdf6f5', 100: '#f9e8e6', 200: '#f0cdc9', 300: '#e3aaa5' }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ValverdePreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'tailwind-base, primeng, tailwind-utilities' }
        }
      },
      ripple: true
    }),
    MessageService
  ]
};
