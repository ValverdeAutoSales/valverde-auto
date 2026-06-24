import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car, CarPayload, CarStatus } from '../models/car.model';

const LOCAL_KEY = 'valverde_cars';
const API       = `${environment.apiUrl}/cars`;

const SEED: Car[] = [
  { id:1, brand:'Toyota',  model:'Corolla Cross', version:'SE-G Hybrid', year:2024, price:24990, mileage:0,     fuelType:'Híbrido',  transmission:'Automática', status:'Disponible', image:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80', tags:['0 km','Híbrido','SUV'] },
  { id:2, brand:'Hyundai', model:'Tucson',         version:'Limited 2.0', year:2023, price:27500, mileage:12000, fuelType:'Gasolina', transmission:'Automática', status:'Disponible', image:'assets/images/cars/HyundaiTupson.jpg',         tags:['SUV','Full equipo'] },
  { id:3, brand:'Hyundai', model:'Santa Fe Se',    version:'EX 1.6T',     year:2017, price:25900, mileage:8000,  fuelType:'Gasolina', transmission:'Automática', status:'Reservado',  image:'assets/images/cars/HyundaiSantaFeSe2017.jpg', tags:['SUV','Turbo'] },
  { id:4, brand:'Suzuki',  model:'Swift',           version:'GLX',         year:2024, price:14990, mileage:0,     fuelType:'Gasolina', transmission:'Manual',     status:'Disponible', image:'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80', tags:['0 km','Económico'] },
  { id:5, brand:'Nissan',  model:'Versa',           version:'Advance',     year:2022, price:13990, mileage:21000, fuelType:'Gasolina', transmission:'Automática', status:'Vendido',    image:'assets/images/cars/nissan-versa-2022.jpg',    tags:['Sedán','Seminuevo'] },
  { id:6, brand:'Jeep',    model:'Grand Cherokee',  version:'Limited',     year:2016, price:22990, mileage:85000, fuelType:'Gasolina', transmission:'Automática', status:'Disponible', image:'assets/images/cars/Jeep Grand Cherokee (WK2).jpg', tags:['SUV','4x4'] }
];

/**
 * CarService — Estrategia API-first con fallback localStorage.
 *
 * ① Intenta todas las operaciones contra el backend Spring Boot.
 * ② Si el backend responde 0 / CORS / red → usa localStorage como cache offline.
 * ③ Las imágenes Base64 se almacenan directamente en el campo `image`.
 */
@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);
  private readonly _cars = signal<Car[]>([]);

  readonly cars = this._cars.asReadonly();

  constructor() { this.loadAll(); }

  // ── READ ──────────────────────────────────────────────────────────────────
  async loadAll(): Promise<void> {
    try {
      const list = await firstValueFrom(this.http.get<Car[]>(API));
      this._cars.set(list);
      this.persist(list);
    } catch {
      this._cars.set(this.fromLocal());
    }
  }

  getFeatured(limit = 3): Car[] {
    return this._cars().filter(c => c.status === 'Disponible').slice(0, limit);
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(payload: CarPayload): Promise<Car> {
    try {
      const created = await firstValueFrom(this.http.post<Car>(API, payload));
      this._cars.update(list => [...list, created]);
      this.persist(this._cars());
      return created;
    } catch {
      const local: Car = { ...payload, id: this.nextId() };
      this._cars.update(list => [...list, local]);
      this.persist(this._cars());
      return local;
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: number, payload: CarPayload): Promise<void> {
    try {
      const updated = await firstValueFrom(this.http.put<Car>(`${API}/${id}`, payload));
      this._cars.update(list => list.map(c => c.id === id ? updated : c));
    } catch {
      this._cars.update(list => list.map(c => c.id === id ? { ...payload, id } : c));
    }
    this.persist(this._cars());
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${API}/${id}`));
    } catch { /* offline — eliminar sólo local */ }
    this._cars.update(list => list.filter(c => c.id !== id));
    this.persist(this._cars());
  }

  // ── IMAGE UPLOAD ──────────────────────────────────────────────────────────
  /**
   * Mejor estrategia para imágenes:
   * 1. Si el backend tiene endpoint /cars/upload → sube el archivo y guarda la URL pública.
   * 2. Si no → convierte a Base64 y guarda en el campo `image` de la BD.
   *
   * La función devuelve la URL/Base64 lista para usar en el formulario.
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await firstValueFrom(
        this.http.post<{ url: string }>(`${environment.apiUrl}/cars/upload`, form)
      );
      return res.url;           // URL pública devuelta por el backend
    } catch {
      // Fallback: Base64
      return this.toBase64(file);
    }
  }

  // ── Privados ──────────────────────────────────────────────────────────────
  private persist(list: Car[]): void {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { }
  }

  private fromLocal(): Car[] {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) as Car[] : SEED;
    } catch {
      return SEED;
    }
  }

  private nextId(): number {
    const cars = this._cars();
    return cars.length ? Math.max(...cars.map(c => c.id)) + 1 : 1;
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = () => res(r.result as string);
      r.onerror = () => rej(new Error('FileReader error'));
      r.readAsDataURL(file);
    });
  }
}
