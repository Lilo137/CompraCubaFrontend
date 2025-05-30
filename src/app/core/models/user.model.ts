export enum UserRole {
  USER = 'USER',
  MIPYME = 'MIPYME'
}

export interface User {
  id?: string;
  username: string;
  email: string;
  provincia: string;
  role: UserRole;
  token?: string; // Para la sesión
}