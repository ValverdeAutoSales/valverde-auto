import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { I18nService } from '../../../../core/services/i18n.service';

interface Slide { title: string; subtitle: string; cta: string; image: string; }

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselModule, ButtonModule, RouterLink],
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss'],
})
export class HeroCarouselComponent {
  readonly i18n = inject(I18nService);

  private readonly images = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80'
  ];

  readonly slides = computed<Slide[]>(() => {
    const raw = this.i18n.getArray<{ title: string; subtitle: string; cta: string }>('landing.slides');
    return raw.length
      ? raw.map((s, i) => ({ ...s, image: this.images[i] ?? this.images[0] }))
      : this.images.map((image, i) => ({
          title: `Slide ${i + 1}`, subtitle: '', cta: 'Ver catálogo', image
        }));
  });
}
