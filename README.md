# Valverde Auto Sales — Frontend

Proyecto Angular 20 + PrimeNG 19 + Tailwind CSS, con tema "Rose Gold"
inspirado en el logo de Valverde Auto Sales.

## Estructura

```
src/app/
  core/
    models/        -> interfaces (Car, User, AuthResponse)
    services/      -> AuthService (JWT), CarService (API-first + fallback),
                      I18nService (4 idiomas)
    guards/        -> authGuard, guestGuard
    interceptors/  -> jwtInterceptor (Bearer token automático)
  shared/
    components/
      header/               -> navegación principal + LanguageSelector
      footer/               -> pie de página
      floating-actions/     -> barra flotante (Autos / Asesor / Cotizar)
      language-selector/    -> selector de idioma (EN/ES/PT/ZH)
      brand-logo/           -> logo horizontal reutilizable
  features/
    landing/      -> hero carousel, beneficios, destacados
    catalog/      -> catálogo con búsqueda, filtros y contacto WhatsApp
    auth/login/   -> login Cliente / Administrador con JWT
    admin/dashboard -> CRUD completo (crear, editar, eliminar, subir imagen)
```

## Cómo correr

```bash
npm install
npm start
# → http://localhost:4200
```

## Autenticación

- **Admin:** 
- **Cliente:** cualquier correo válido + contraseña de 4+ caracteres
- El JWT se inyecta automáticamente en todas las peticiones via `jwtInterceptor`

## i18n — Idiomas soportados

| Código | Idioma     | Bandera |
|--------|------------|---------|
| en     | English    | 🇺🇸     |
| es     | Español    | 🇵🇪     |
| pt     | Português  | 🇧🇷     |
| zh     | 中文       | 🇨🇳     |

Los textos están en `src/assets/i18n/{lang}.json`.
El `LanguageSelectorComponent` aparece en el header y guarda la preferencia en `localStorage`.

## Backend API

Apunta a: `https://api`

Configurado en `src/environments/environment.ts`.

El `CarService` usa estrategia **API-first con fallback localStorage**:
si el backend no responde, opera offline y sincroniza cuando vuelva.

## Tema (Rose Gold)

Preset PrimeNG en `src/app/app.config.ts`
Paleta Tailwind en `tailwind.config.js`

## Deploy GitHub Pages

Settings → Pages → Source → **GitHub Actions**
Push a `main` → workflow automático → https://ValverdeAutoSales.github.io/valverde-auto/
