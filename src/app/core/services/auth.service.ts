import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, User } from '../models/user.model';

const SESSION_KEY = 'valverde_session';
const TOKEN_KEY   = 'valverde_jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user  = signal<User | null>(this.restoreSession());

  readonly user            = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin         = computed(() => this._user()?.role === 'admin');

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  async login(payload: LoginPayload): Promise<User> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
          email: payload.email, 
          password: payload.password
        })
      );
      
      // El role viene del backend, no del frontend
      const user: User = {
        id: res.user?.id || 1,
        name: res.user?.name || payload.email.split('@')[0],
        email: payload.email,
        role: res.user?.role || 'cliente'
      };
      
      return this.saveSession(res, user);
    } catch (err) {
      throw this.parseError(err);
    }
  }

  // ── REGISTER ──────────────────────────────────────────────────────────────
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
          name, 
          email, 
          password
        })
      );
      
      const user: User = {
        id: res.user?.id || Date.now(),
        name: name,
        email: email,
        role: res.user?.role || 'cliente'
      };
      
      return this.saveSession(res, user);
    } catch (err) {
      throw this.parseError(err);
    }
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }

  // ── Privados ──────────────────────────────────────────────────────────────
  private saveSession(res: AuthResponse, user: User): User {
    const token = res.token || btoa(`${user.email}:${Date.now()}`);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this._user.set(user);
    return user;
  }

  private parseError(err: unknown): Error {
    if (err instanceof HttpErrorResponse) {
      // Mostrar el mensaje del backend
      const message = err.error?.error || err.error?.message || err.message || 'Error del servidor.';
      return new Error(message);
    }
    return err instanceof Error ? err : new Error('Error inesperado.');
  }

  private restoreSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch { 
      return null; 
    }
  }
}