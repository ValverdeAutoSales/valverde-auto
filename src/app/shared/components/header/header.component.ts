import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule, LanguageSelectorComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly auth     = inject(AuthService);
  readonly i18n     = inject(I18nService);
  readonly menuOpen = signal(false);

  toggleMenu(): void { this.menuOpen.update(o => !o); }
  closeMenu():  void { this.menuOpen.set(false); }
}
