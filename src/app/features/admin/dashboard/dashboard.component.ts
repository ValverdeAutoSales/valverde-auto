import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CarService } from '../../../core/services/car.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { CarImagePipe } from '../../../shared/pipes/car-image.pipe';
import { Car, CarPayload, CarStatus, FuelType, Transmission } from '../../../core/models/car.model';


type DialogMode = 'create' | 'edit';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    CarImagePipe          // ← resuelve /images/cars/uuid.jpg → https://server/images/cars/uuid.jpg
  ],
  providers: [ConfirmationService],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  readonly carService = inject(CarService);
  readonly auth       = inject(AuthService);
  readonly i18n       = inject(I18nService);

  private readonly fb = inject(FormBuilder);
  private readonly cs = inject(ConfirmationService);
  private readonly ms = inject(MessageService);

  readonly cars           = this.carService.cars;
  readonly showDialog     = signal(false);
  readonly dialogMode     = signal<DialogMode>('create');
  readonly editingId      = signal<number | null>(null);
  readonly imagePreview   = signal<string>('');
  readonly saving         = signal(false);
  readonly uploadingImage = signal(false);
  readonly deleting       = signal<number | null>(null);

  readonly stats = computed(() => {
    const c = this.cars();
    return {
      total:     c.length,
      available: c.filter(x => x.status === 'Disponible').length,
      reserved:  c.filter(x => x.status === 'Reservado').length,
      sold:      c.filter(x => x.status === 'Vendido').length
    };
  });

  readonly statusOptions: { label: string; value: CarStatus }[] = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'Reservado',  value: 'Reservado'  },
    { label: 'Vendido',    value: 'Vendido'    }
  ];

  readonly fuelOptions: { label: string; value: FuelType }[] = [
    { label: 'Gasolina',  value: 'Gasolina'  },
    { label: 'Diésel',    value: 'Diésel'    },
    { label: 'Híbrido',   value: 'Híbrido'   },
    { label: 'Eléctrico', value: 'Eléctrico' }
  ];

  readonly txOptions: { label: string; value: Transmission }[] = [
    { label: 'Automática', value: 'Automática' },
    { label: 'Manual',     value: 'Manual'     }
  ];

  readonly form = this.fb.nonNullable.group({
    brand:        ['', Validators.required],
    model:        ['', Validators.required],
    version:      ['', Validators.required],
    year:         [new Date().getFullYear(), [Validators.required, Validators.min(1990), Validators.max(2035)]],
    price:        [0,  [Validators.required, Validators.min(1)]],
    mileage:      [0,  [Validators.required, Validators.min(0)]],
    fuelType:     ['Gasolina'   as FuelType,    Validators.required],
    transmission: ['Automática' as Transmission, Validators.required],
    status:       ['Disponible' as CarStatus,    Validators.required],
    image:        ['', Validators.required],
    tags:         ['']
  });

  // ── Abrir/cerrar modal ────────────────────────────────────────────────────
  openCreate(): void {
    this.dialogMode.set('create');
    this.editingId.set(null);
    this.imagePreview.set('');
    this.form.reset({
      brand: '', model: '', version: '',
      year: new Date().getFullYear(),
      price: 0, mileage: 0,
      fuelType: 'Gasolina', transmission: 'Automática', status: 'Disponible',
      image: '', tags: ''
    });
    this.showDialog.set(true);
  }

  openEdit(car: Car): void {
    this.dialogMode.set('edit');
    this.editingId.set(car.id);
    this.imagePreview.set(car.image);
    this.form.setValue({
      brand: car.brand, model: car.model, version: car.version,
      year: car.year, price: car.price, mileage: car.mileage,
      fuelType: car.fuelType, transmission: car.transmission,
      status: car.status, image: car.image,
      tags: car.tags.join(', ')
    });
    this.showDialog.set(true);
  }

  // ── Imagen ────────────────────────────────────────────────────────────────
  onImageUrlChange(url: string): void {
    this.imagePreview.set(url);
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    // Validar tamaño (10 MB máx)
    if (file.size > 10 * 1024 * 1024) {
      this.ms.add({ severity: 'warn', summary: 'Archivo muy grande', detail: 'Máximo 10 MB.' });
      return;
    }

    this.uploadingImage.set(true);
    try {
      const url = await this.carService.uploadImage(file);
      this.form.patchValue({ image: url });
      this.imagePreview.set(url);
    } catch {
      this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se pudo subir la imagen.' });
    } finally {
      this.uploadingImage.set(false);
    }
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────
  async save(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImage()) { return; }

    this.saving.set(true);
    const raw = this.form.getRawValue();

    const payload: CarPayload = {
      brand: raw.brand, model: raw.model, version: raw.version,
      year: raw.year, price: raw.price, mileage: raw.mileage,
      fuelType: raw.fuelType, transmission: raw.transmission,
      status: raw.status, image: raw.image,
      tags: raw.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (this.dialogMode() === 'create') {
        await this.carService.create(payload);
        this.ms.add({
          severity: 'success',
          summary: this.i18n.get('dashboard.saved_ok'),
          detail: `${raw.brand} ${raw.model} ${this.i18n.get('dashboard.saved_detail')}`
        });
      } else {
        await this.carService.update(this.editingId()!, payload);
        this.ms.add({
          severity: 'success',
          summary: this.i18n.get('dashboard.updated_ok'),
          detail: `${raw.brand} ${raw.model} ${this.i18n.get('dashboard.updated_detail')}`
        });
      }
      this.showDialog.set(false);
    } catch (e) {
      this.ms.add({ severity: 'error', summary: 'Error', detail: String(e) });
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(car: Car): void {
    this.cs.confirm({
      message: this.i18n.get('dashboard.confirm_delete_msg', { brand: car.brand, model: car.model }),
      header:  this.i18n.get('dashboard.confirm_delete_title'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:            this.i18n.get('dashboard.confirm_yes'),
      rejectLabel:            this.i18n.get('dashboard.confirm_no'),
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        this.deleting.set(car.id);
        try {
          await this.carService.delete(car.id);
          this.ms.add({
            severity: 'warn',
            summary: this.i18n.get('dashboard.deleted_ok'),
            detail: `${car.brand} ${car.model} ${this.i18n.get('dashboard.deleted_detail')}`
          });
        } catch (e) {
          this.ms.add({ severity: 'error', summary: 'Error', detail: String(e) });
        } finally {
          this.deleting.set(null);
        }
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  statusSeverity(s: CarStatus): 'success' | 'warn' | 'danger' {
    return s === 'Disponible' ? 'success' : s === 'Reservado' ? 'warn' : 'danger';
  }

  formatPrice(v: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(v);
  }

  get dialogTitle(): string {
    return this.dialogMode() === 'create'
      ? this.i18n.get('dashboard.create_title')
      : this.i18n.get('dashboard.edit_title');
  }
}
