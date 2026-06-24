// user.model.ts
export interface LoginPayload {
  email: string;
  password: string;
  // role ya no es necesario, viene del backend
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'cliente';
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cliente';
}