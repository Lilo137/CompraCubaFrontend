// src/app/components/mipyme/mipyme-orders.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-mipyme-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mipyme-orders.component.html',
  styleUrls: ['./mipyme-orders.component.css'],
})
export class MipymeOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // Tarifa de envío fija y tasa de impuesto
  readonly shippingFee = 10;
  readonly taxRate = 0.15;

  ngOnInit() {
    if (!this.auth.isAuthenticated() || this.auth.user?.rolID !== 2) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (list: Order[]) => {
        this.orders = list;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.loading = false;
      },
    });
  }

  computeSubtotal(order: Order): number {
    return order.products
      .map(item => item.product.price * item.cantidad)
      .reduce((a, b) => a + b, 0);
  }

  computeShipping(_: Order): number {
    return this.shippingFee;
  }

  computeTax(order: Order): number {
    const sub = this.computeSubtotal(order);
    return parseFloat((sub * this.taxRate).toFixed(2));
  }

  computeTotal(order: Order): number {
    const sub = this.computeSubtotal(order);
    const tax = this.computeTax(order);
    return parseFloat((sub + this.computeShipping(order) + tax).toFixed(2));
  }

  deleteOrder(orderId: number) {
    if (!confirm('¿Seguro que quieres eliminar este pedido?')) return;
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => this.loadOrders(),
      error: (err) => {
        console.error('Error eliminando pedido:', err);
        this.error = 'No se pudo eliminar el pedido.';
      },
    });
  }

  /** Si una imagen falla al cargar, asigna el placeholder local */
  onImgError(event: Event) {
    const imgEl = event.target as HTMLImageElement;
    imgEl.src = '/assets/no-image.png';
  }
}
