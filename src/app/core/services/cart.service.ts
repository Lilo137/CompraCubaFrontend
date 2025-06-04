// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface CartItem {
  productId: number;      // <— debe existir exactamente esta línea
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  envio: number;
  total: number;
  metodoPago: string | null;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'http://localhost:3000';
  // Para comunicar la cuenta de ítems a otros componentes (header)
  private _itemCount$ = new BehaviorSubject<number>(0);
  readonly itemCount$ = this._itemCount$.asObservable();

  constructor(private http: HttpClient) {}

  /** Agrega un producto al carrito del usuario logueado */
  agregarProducto(productId: number, cantidad: number = 1): Observable<any> {
    // No enviamos userID porque nuestro backend extrae userID del JWT
    const body = { productId, cantidad };
    return this.http.post(`${this.baseUrl}/carrito/agregar`, body).pipe(
      tap(() => {
        // después de agregar, actualizamos el contador de ítems recargando el carrito
        this.getResumen().subscribe();
      })
    );
  }

  /** Obtiene el resumen completo del carrito */
  getResumen(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.baseUrl}/carrito/resumen`).pipe(
      tap(summary => {
        // Actualizar la cantidad total de ítems para el header
        const totalItems = summary.items.reduce((acc, item) => acc + item.cantidad, 0);
        this._itemCount$.next(totalItems);
      })
    );
  }
}
