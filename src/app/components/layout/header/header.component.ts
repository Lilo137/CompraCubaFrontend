import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public auth   = inject(AuthService);
  private cartService = inject(CartService);

  cartCount: number = 0;            // cantidad de ítems en carrito
  showSearchBar = false;            // controlar visibilidad de barra de búsqueda
  searchTerm: string = '';          // término de búsqueda (ngModel)
  selectedCategory: string = 'Ninguna';

  categories: string[] = [
    'Ninguna',
    'Pc Escritorio',
    'Laptop',
    'Microprocesador',
    'Monitor',
    'Motherboard',
    'Memoria Flash/RAM',
    'Disco Duro Interno/Externo',
    'Chasis/Fuente',
    'Tarjeta de Video',
    'Tarjeta Sonido/Bocinas'
  ];

  ngOnInit() {
    // 1) Si el usuario está autenticado y NO es mipyme, cargar el resumen del carrito
    if (this.auth.isAuthenticated() && !this.auth.isMipyme()) {
      this.cartService.getResumen().subscribe(); // dispara la carga inicial
    }
    // 2) Suscribirnos a cambios del contador
    this.cartService.itemCount$.subscribe(count => {
      this.cartCount = count;
    });

    // 3) Mostrar sólo en ruta exacta "/"
    this.updateSearchVisibility(this.router.url);
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe((evt: any) => {
        this.updateSearchVisibility(evt.urlAfterRedirects);
      });

    // 4) Leer queryParams iniciales para searchTerm + selectedCategory
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
      this.selectedCategory = params.get('cat') || 'Ninguna';
    });
  }

  private updateSearchVisibility(url: string) {
    // Mostrar búsqueda solo si la ruta es exactamente "/"
    this.showSearchBar = url.split('?')[0] === '/';
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchTerm || null,
        cat: (this.selectedCategory && this.selectedCategory !== 'Ninguna') ? this.selectedCategory : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onCategoryChange(value: string) {
    this.selectedCategory = value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchTerm || null,
        cat: (this.selectedCategory && this.selectedCategory !== 'Ninguna') ? this.selectedCategory : null
      },
      queryParamsHandling: 'merge'
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
