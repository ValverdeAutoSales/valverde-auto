import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type Lang = 'en' | 'es' | 'pt' | 'zh';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'es', label: 'Español',   flag: '🇵🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: '中文',       flag: '🇨🇳' }
];

const STORAGE_KEY = 'valverde_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);

  private readonly _lang         = signal<Lang>(this.detectLang());
  private readonly _translations = signal<Record<string, unknown>>({});

  readonly lang     = this._lang.asReadonly();
  readonly langMeta = computed(() => LANGUAGES.find(l => l.code === this._lang())!);

  constructor() {
    effect(() => { this.load(this._lang()); });
  }

  setLang(lang: Lang): void {
    this._lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  /**
   * Obtiene un texto traducido.
   * Uso: i18n.get('nav.home')  o  i18n.get('msg', { name: 'Toyota' })
   * Devuelve siempre string — nunca Record<string, unknown>.
   */
  get(key: string, params?: Record<string, string | number>): string {
    const keys  = key.split('.');
    let   value: unknown = this._translations();
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) break;
    }
    let text = typeof value === 'string' ? value : key;
    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        (text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)))
      );
    }
    return text;
  }

  /**
   * Obtiene un array traducido (para listas de beneficios, slides, etc.).
   * Devuelve T[] o [] si la clave no apunta a un array.
   */
  getArray<T = Record<string, unknown>>(key: string): T[] {
    const keys  = key.split('.');
    let   value: unknown = this._translations();
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) break;
    }
    return Array.isArray(value) ? (value as T[]) : [];
  }

  private async load(lang: Lang): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<Record<string, unknown>>(`assets/i18n/${lang}.json`)
      );
      this._translations.set(data);
    } catch {
      console.warn(`[i18n] Could not load ${lang}.json`);
    }
  }

  private detectLang(): Lang {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    const browser = navigator.language.slice(0, 2) as Lang;
    return LANGUAGES.some(l => l.code === browser) ? browser : 'es';
  }
}
