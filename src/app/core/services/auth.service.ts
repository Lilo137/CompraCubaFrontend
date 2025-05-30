// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginDto  { email: string; password: string; }
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  provincia: string;
  metodoPago: 'Enzona' | 'Transfermovil';
  rolID: number;
}
export interface AuthResponse { access_token: string; user: any; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(credentials: LoginDto): Observable<AuthResponse> {
  console.log('[AuthService] login() llamado con:', credentials);
  return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
    .pipe(
      tap(res => {
        console.log('[AuthService] respuesta recibida:', res);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.access_token);
        }
      })
    );
}

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  get token(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
