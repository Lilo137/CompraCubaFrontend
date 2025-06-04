// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  provincia: string | null;
  metodoPago: 'Enzona' | 'Transfermovil';
  // otros campos si los agregas (por ejemplo: telefono?: string)
}

export interface UpdateUserDto {
  provincia?: string;
  metodoPago?: 'Enzona' | 'Transfermovil';
  password?: string;
  // telefono?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  /** Obtiene un usuario por ID */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /** Actualiza un usuario por ID */
  updateUser(id: number, data: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, data).pipe(
      tap(updated => {
         const stored = localStorage.getItem('user');
         if (stored) {
           const parsed = JSON.parse(stored);
           if (parsed.id === updated.id) {
             localStorage.setItem('user', JSON.stringify({
               ...parsed,
               provincia: updated.provincia,
               metodoPago: updated.metodoPago
             }));
           }
         }
      })
    );
  }
}
