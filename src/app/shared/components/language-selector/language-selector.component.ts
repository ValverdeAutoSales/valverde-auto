import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { I18nService, LANGUAGES, Lang } from '../../../core/services/i18n.service';

/**
 * LanguageSelectorComponent
 * Dropdown con bandera + nombre para seleccionar idioma.
 * Se coloca en el Header (y opcionalmente en el Footer).
 * Idiomas: English 🇺🇸 | Español 🇵🇪 | Português 🇧🇷 | 中文 🇨🇳
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-selector.component.html'
})
export class LanguageSelectorComponent {
  readonly i18n      = inject(I18nService);
  readonly languages = LANGUAGES;
  readonly open      = signal(false);

  toggle():         void { this.open.update(v => !v); }
  close():          void { this.open.set(false); }
  select(l: Lang):  void { this.i18n.setLang(l); this.close(); }
}
