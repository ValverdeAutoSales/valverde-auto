import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege rutas que requieren sesión iniciada.
 * Si la ruta define `data.role`, además valida que el usuario tenga ese rol.
 */
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRole = route.data['role'] as string | undefined;
  if (requiredRole && auth.user()?.role !== requiredRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};

/**
 * Evita que un usuario autenticado vuelva a ver la pantalla de login.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(auth.isAdmin() ? ['/admin'] : ['/']);
  }

  return true;
};
