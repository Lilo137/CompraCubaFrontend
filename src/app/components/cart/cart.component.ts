import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,  // Solo si estás usando componentes independientes
  imports: [CommonModule]  // Necesario para directivas y pipes comunes
})
export class CartComponent {
  // Definición de la propiedad 'cart' que se usa en el template
  cart = {
    items: [] as Array<{
      product: any,  // Reemplaza 'any' con tu interfaz de Producto
      quantity: number,
      price: number
    }>,
    total: 0
  };

  constructor(private router: Router) {}

  // Método para ir al checkout
  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Método para formatear números (alternativa al pipe number)
  formatNumber(value: number): string {
    return value.toLocaleString(); // Formatea el número con separadores de miles
  }
}