// import { Component, computed, inject, signal } from '@angular/core';
// import { DecimalPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { InputTextModule } from 'primeng/inputtext';
// import { SelectModule } from 'primeng/select';
// import { TagModule } from 'primeng/tag';
// import { ButtonModule } from 'primeng/button';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
// import { Car } from '../../core/models/car.model';
// import { CarService } from '../../core/services/car.service';

// @Component({
//   selector: 'app-catalog',
//   standalone: true,
//   imports: [FormsModule, DecimalPipe, InputTextModule, SelectModule, TagModule, ButtonModule, IconFieldModule, InputIconModule],
//   templateUrl: './catalog.component.html'
// })
// export class CatalogComponent {
//   private readonly carService = inject(CarService);

//   readonly cars = this.carService.cars;

//   readonly searchTerm = signal('');
//   readonly selectedBrand = signal<string | null>(null);

//   readonly brandOptions = computed(() => {
//     const brands = Array.from(new Set(this.cars().map((c) => c.brand))).sort();
//     return [{ label: 'Todas las marcas', value: null }, ...brands.map((b) => ({ label: b, value: b }))];
//   });

//   readonly filteredCars = computed(() => {
//     const term = this.searchTerm().trim().toLowerCase();
//     const brand = this.selectedBrand();

//     return this.cars().filter((car) => {
//       const matchesBrand = !brand || car.brand === brand;
//       const matchesTerm =
//         !term ||
//         `${car.brand} ${car.model} ${car.version}`.toLowerCase().includes(term);
//       return matchesBrand && matchesTerm;
//     });
//   });

//   statusSeverity(status: Car['status']): 'success' | 'warn' | 'danger' {
//     switch (status) {
//       case 'Disponible':
//         return 'success';
//       case 'Reservado':
//         return 'warn';
//       default:
//         return 'danger';
//     }
//   }

//   formatPrice(value: number): string {
//     return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
//   }

//   resetFilters(): void {
//     this.searchTerm.set('');
//     this.selectedBrand.set(null);
//   }
// }


import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea'; // ✅ Cambio aquí
import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    FormsModule, 
    DecimalPipe, 
    InputTextModule, 
    SelectModule, 
    TagModule, 
    ButtonModule, 
    IconFieldModule, 
    InputIconModule,
    DialogModule,
    TextareaModule // ✅ Cambio aquí
  ],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {
  private readonly carService = inject(CarService);

  readonly cars = this.carService.cars;
  readonly searchTerm = signal('');
  readonly selectedBrand = signal<string | null>(null);
  
  // Estado para el diálogo de contacto
  readonly showContactDialog = signal(false);
  readonly selectedCar = signal<Car | null>(null);
  
  // Datos del formulario de contacto
  contactData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    carInfo: ''
  };

  readonly brandOptions = computed(() => {
    const brands = Array.from(new Set(this.cars().map((c) => c.brand))).sort();
    return [{ label: 'Todas las marcas', value: null }, ...brands.map((b) => ({ label: b, value: b }))];
  });

  readonly filteredCars = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const brand = this.selectedBrand();

    return this.cars().filter((car) => {
      const matchesBrand = !brand || car.brand === brand;
      const matchesTerm =
        !term ||
        `${car.brand} ${car.model} ${car.version}`.toLowerCase().includes(term);
      return matchesBrand && matchesTerm;
    });
  });

  statusSeverity(status: Car['status']): 'success' | 'warn' | 'danger' {
    switch (status) {
      case 'Disponible':
        return 'success';
      case 'Reservado':
        return 'warn';
      default:
        return 'danger';
    }
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedBrand.set(null);
  }

  // Abrir diálogo de contacto para un vehículo específico
  openContactDialog(car: Car): void {
    this.selectedCar.set(car);
    this.contactData = {
      name: '',
      phone: '',
      email: '',
      message: '',
      carInfo: `${car.brand} ${car.model} ${car.version} (${car.year}) - ${this.formatPrice(car.price)}`
    };
    this.showContactDialog.set(true);
  }

  // Cerrar diálogo
  closeContactDialog(): void {
    this.showContactDialog.set(false);
    this.selectedCar.set(null);
  }

  // Enviar mensaje por WhatsApp
  sendWhatsAppMessage(): void {
    const car = this.selectedCar();
    if (!car) return;

    // Número del asesor
    const advisorPhone = '+13172490169';
    
    // Construir mensaje personalizado
    let message = `Hola, estoy interesado en el vehículo:\n\n`;
    message += `🚗 ${car.brand} ${car.model} ${car.version}\n`;
    message += `📅 Año: ${car.year}\n`;
    message += `💰 Precio: ${this.formatPrice(car.price)}\n`;
    message += `📊 Estado: ${car.status}\n`;
    message += `⛽ Combustible: ${car.fuelType}\n`;
    message += `🔧 Transmisión: ${car.transmission}\n`;
    message += `📏 Kilometraje: ${car.mileage.toLocaleString()} km\n\n`;
    
    // Agregar información del cliente si está disponible
    if (this.contactData.name) {
      message += `👤 Nombre: ${this.contactData.name}\n`;
    }
    if (this.contactData.phone) {
      message += `📱 Teléfono: ${this.contactData.phone}\n`;
    }
    if (this.contactData.email) {
      message += `📧 Email: ${this.contactData.email}\n`;
    }
    if (this.contactData.message) {
      message += `\n💬 Mensaje:\n${this.contactData.message}`;
    }
    
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${advisorPhone}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Cerrar diálogo después de un momento
    setTimeout(() => {
      this.closeContactDialog();
    }, 500);
  }

  // Enviar por correo (alternativa)
  sendEmail(): void {
    const car = this.selectedCar();
    if (!car) return;

    const subject = `Consulta sobre ${car.brand} ${car.model} ${car.version}`;
    let body = `Hola, estoy interesado en el siguiente vehículo:\n\n`;
    body += `${car.brand} ${car.model} ${car.version}\n`;
    body += `Año: ${car.year}\n`;
    body += `Precio: ${this.formatPrice(car.price)}\n`;
    body += `Estado: ${car.status}\n\n`;
    
    if (this.contactData.name) {
      body += `Nombre: ${this.contactData.name}\n`;
    }
    if (this.contactData.phone) {
      body += `Teléfono: ${this.contactData.phone}\n`;
    }
    if (this.contactData.email) {
      body += `Email: ${this.contactData.email}\n`;
    }
    if (this.contactData.message) {
      body += `\nMensaje:\n${this.contactData.message}`;
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
    
    setTimeout(() => {
      this.closeContactDialog();
    }, 500);
  }
}