import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  precioGeneral: number;
  imagenes: Array<{ id: number; url: string }>; // ej: [ { id, url: "/uploads/archivo.png" }, ... ]
  categoria: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  public auth = inject(AuthService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  /** URL base de la API */
  apiUrl = 'http://localhost:3000';

  allProducts: Product[] = [];       // todos los productos del backend
  filteredProducts: Product[] = [];  // productos filtrados
  loading = false;
  error: string | null = null;

  searchTerm: string = '';
  selectedCategory: string = 'Ninguna';

  // Modal de detalle:
  selectedProduct: Product | null = null;
  currentImgIndex = 0;

  private subQuery!: Subscription;

  ngOnInit() {
    this.loading = true;
    // Obtener TODOS los productos
    this.productService.getAll().subscribe({
      next: (list: Product[]) => {
        this.allProducts = list;
        this.setupQueryParamSubscription();
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      }
    });
  }

  private setupQueryParamSubscription() {
    // Suscribirse a queryParams para filtrar en tiempo real
    this.subQuery = this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
      this.selectedCategory = params.get('cat') || 'Ninguna';
      this.applyFilters();
    });
    // Llamada inicial a filtros
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchesName = this.searchTerm
        ? p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesCat = (this.selectedCategory && this.selectedCategory !== 'Ninguna')
        ? p.categoria === this.selectedCategory
        : true;
      return matchesName && matchesCat;
    });
  }

  addToCart(productId: number) {
    if (!this.auth.isAuthenticated() || this.auth.isMipyme()) {
      return;
    }
    this.cartService.agregarProducto(productId, 1).subscribe({
      next: () => alert('Producto añadido al carrito'),
      error: (err: any) => console.error('Error al añadir al carrito', err)
    });
  }

  onImgError(event: Event) {
    const imgEl = event.target as HTMLImageElement;
    imgEl.src = '/assets/no-image.png';
  }

  openDetail(prod: Product) {
    this.selectedProduct = prod;
    this.currentImgIndex = 0;
  }

  closeDetail() {
    this.selectedProduct = null;
  }

  prevImg() {
    if (!this.selectedProduct) return;
    const len = this.selectedProduct.imagenes.length;
    this.currentImgIndex = (this.currentImgIndex - 1 + len) % len;
  }

  nextImg() {
    if (!this.selectedProduct) return;
    const len = this.selectedProduct.imagenes.length;
    this.currentImgIndex = (this.currentImgIndex + 1) % len;
  }

  ngOnDestroy() {
    this.subQuery?.unsubscribe();
  }
}
