import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'valverde_jwt';

/**
 * Inyecta el Bearer token JWT en todas las peticiones HTTP salientes.
 * Funcional con el nuevo sistema de interceptores de Angular 17+.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
