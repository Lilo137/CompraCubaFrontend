import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Podrías cargar el usuario desde localStorage aquí
  }

  login(credentials: { email: string, password: string }): Observable<User> {
    // Simulación: Reemplazar con llamada HTTP real
    console.log('Login attempt:', credentials);
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: '1',
        username: 'Usuario Ejemplo',
        email: 'user@example.com',
        provincia: 'La Habana',
        role: UserRole.USER,
        token: 'fake-jwt-token'
      };
      this.currentUserSubject.next(mockUser);
      // localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return of(mockUser);
    }
    return throwError(() => new Error('Credenciales inválidas'));
  }

  register(userData: Omit<User, 'id' | 'token'>): Observable<User> {
    // Simulación: Reemplazar con llamada HTTP real
    console.log('Register attempt:', userData);
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      ...userData,
      token: 'fake-jwt-token-new-user'
    };
    this.currentUserSubject.next(newUser);
    // localStorage.setItem('currentUser', JSON.stringify(newUser));
    return of(newUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    // localStorage.removeItem('currentUser');
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}