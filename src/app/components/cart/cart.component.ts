// src/app/components/cart/cart.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  CartService,
  CartSummary,
  CartItem,
} from '../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  /** URL base de la API */
  apiUrl = 'http://localhost:3000';

  cart: CartSummary | null = null;
  error: string | null = null;
  paymentMethod: 'Enzona' | 'Transfermovil' = 'Enzona';
  taxRate = 0.15;
  taxAmount = 0;

  /** CONTROL DEL MODAL DE PAGO */
  showPaymentModal = false;
  qrImageUrl: string | null = null;
  countdownSub!: Subscription;
  countdownRemaining = 600; // segundos (10 minutos)

  ngOnInit() {
    if (!this.authService.isAuthenticated() || this.authService.user?.rolID !== 1) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCart();
  }

  loadCart() {
    this.cartService.getResumen().subscribe({
      next: (summary) => {
        this.cart = summary;
        this.error = null;
        this.calculateTax();
      },
      error: (err) => {
        console.error('Error al cargar carrito:', err);
        this.error = 'No se pudo cargar el carrito.';
      },
    });
  }

  calculateTax() {
    if (!this.cart) {
      this.taxAmount = 0;
      return;
    }
    this.taxAmount = parseFloat((this.cart.subtotal * this.taxRate).toFixed(2));
  }

  /**
   * “cantidadDeseada” es la nueva cantidad que el usuario ingresó (o 0 para eliminar).
   */
  actualizarCantidad(item: CartItem, cantidadDeseada: number) {
    if (!this.cart) return;
    // Backend: si cantidadDeseada es 0, interpreta como eliminación
    this.cartService.agregarProducto(item.productId, cantidadDeseada).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Error al actualizar carrito:', err);
        this.error = 'No se pudo actualizar el carrito.';
      },
    });
  }

  /**
   * Al pulsar “Pagar Ahora” mostramos el modal y arrancamos cuenta regresiva de 10 min.
   */
  checkout() {
    if (!this.cart) return;

    // 1) Determinar la imagen QR según paymentMethod
    if (this.paymentMethod === 'Enzona') {
      this.qrImageUrl = '/assets/qr-enzona.webp';
    } else {
      this.qrImageUrl = '/assets/qr-transfermovil.webp';
    }
    if (!this.qrImageUrl) {
      // Si no hay imagen en localStorage, quizás mostrar placeholder
      this.qrImageUrl = '/assets/no-image.png';
    }

    // 2) Abrir modal
    this.showPaymentModal = true;

    // 3) Arrancar cuenta regresiva de 600 segundos (10 min)
    this.countdownRemaining = 600;
    this.countdownSub = timer(0, 1000)
      .pipe(take(601))
      .subscribe(sec => {
        this.countdownRemaining = 600 - sec;
        if (this.countdownRemaining <= 0) {
          // Si llega a cero, cerramos el modal y avisamos que se canceló
          this.closePaymentModal();
          alert('Tiempo de pago agotado. El pedido ha sido cancelado.');
        }
      });
  }

  /**
   * Cierra el modal y detiene la cuenta regresiva (si está activa).
   */
  closePaymentModal() {
    this.showPaymentModal = false;
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }

  /**
   * Al 点击ar “OK” en el modal, enviamos la request al backend para crear la orden.
   */
  confirmPayment() {
    if (!this.cart || !this.authService.user) return;

    // 1) Construir DTO de CreateOrderDto
    const userID = this.authService.user.id;
    const productsPayload = this.cart.items.map(item => ({
      productId: item.productId,
      cantidad: item.cantidad
    }));
    const dto = {
      userID,
      products: productsPayload
    };

    // 2) Llamar al endpoint POST /order
    this.http.post(`${this.apiUrl}/order`, dto).subscribe({
      next: (res: any) => {
        // 3) Pedido creado con éxito → cerramos modal y vaciamos carrito local
        this.closePaymentModal();
        alert('¡Orden creada exitosamente!');
        // Opcional: recargar el carrito (debería estar vacío tras crear la orden)
        this.loadCart();
      },
      error: err => {
        console.error('Error al crear orden:', err);
        alert('Hubo un error al procesar tu orden. Intenta de nuevo.');
        this.closePaymentModal();
      }
    });
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  /** Si la imagen no carga, mostramos placeholder local */
  onImgError(event: any) {
    event.target.src = '/assets/no-image.png';
  }
}
