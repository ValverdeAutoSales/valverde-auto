import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * CarImagePipe — resuelve la URL completa de una imagen de auto.
 *
 * Reglas (en orden de evaluación):
 *  1. null / vacío            → placeholder
 *  2. http:// o https://      → ya es URL absoluta, no tocar
 *  3. data:image/...          → Base64, no tocar
 *  4. Empieza con /           → ruta relativa del servidor → prepende serverUrl
 *  5. assets/                 → ruta local de Angular, no tocar
 *  6. Cualquier otro caso     → placeholder
 *
 * Uso:
 *   <img [src]="car.image | carImage" />
 *   <img [src]="imagePreview() | carImage" />
 */
@Pipe({ name: 'carImage', standalone: true, pure: true })
export class CarImagePipe implements PipeTransform {

  private readonly placeholder =
    'https://placehold.co/400x240/f9e8e6/bd6f6f?text=Sin+imagen';

  transform(value: string | null | undefined): string {
    if (!value?.trim()) return this.placeholder;

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('data:'))   return value;
    if (value.startsWith('/'))       return `${environment.serverUrl}${value}`;
    if (value.startsWith('assets/')) return value;

    return this.placeholder;
  }
}
