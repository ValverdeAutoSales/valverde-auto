import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CarService } from '../../core/services/car.service';
import { I18nService } from '../../core/services/i18n.service';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { Car } from '../../core/models/car.model';

interface Benefit { icon: string; title: string; description: string; }

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, TagModule, HeroCarouselComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  private readonly carService = inject(CarService);
  readonly i18n               = inject(I18nService);

  readonly featuredCars = this.carService.getFeatured(3);
  readonly brands       = ['Toyota','Hyundai','Kia','Suzuki','Nissan','BYD','Jeep'];

  get benefits(): Benefit[] {
    return this.i18n.getArray<Benefit>('landing.benefits');
  }

  statusSeverity(status: Car['status']): 'success' | 'warn' | 'danger' {
    return status === 'Disponible' ? 'success' : status === 'Reservado' ? 'warn' : 'danger';
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('es-PE',
      { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }
}
