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
export interface AuthResponse {
  access_token: string;
  user: { id: number; username: string; email: string; rolID: number; provincia?: string; metodoPago?: string; };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private _user: { id: number; username: string; email: string; rolID: number; provincia?: string; metodoPago?: string } | null = null;

  constructor(private http: HttpClient) {
    // Solo intento leer de localStorage si existe
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this._user = JSON.parse(storedUser);
        } catch {
          this._user = null;
        }
      }
    }
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(res => {
        // Guardamos en localStorage solo si existe
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this._user = res.user;
      })
    );
  }

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this._user = null;
  }

  get token(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  get user(): { id: number; username: string; email: string; rolID: number; provincia?: string; metodoPago?: string } | null {
    return this._user;
  }

  isMipyme(): boolean {
    return this._user?.rolID === 2;
  }
  setUser(user: { id: number; username: string; email: string; rolID: number; provincia?: string; metodoPago?: string }) {
    this._user = user;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}
