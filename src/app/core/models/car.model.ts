export type FuelType    = 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
export type Transmission = 'Manual' | 'Automática';
export type CarStatus   = 'Disponible' | 'Reservado' | 'Vendido';

export interface Car {
  id:           number;
  brand:        string;
  model:        string;
  version:      string;
  year:         number;
  price:        number;
  mileage:      number;
  fuelType:     FuelType;
  transmission: Transmission;
  status:       CarStatus;
  image:        string;   // URL externa o Base64 cuando se sube local
  tags:         string[];
}

/** DTO para crear/editar (sin id) */
export type CarPayload = Omit<Car, 'id'>;
