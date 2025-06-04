import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';

export interface MyProduct {
  id: number;
  name: string;
  categoria: string;
  description: string;
  stock: number;
  precioGeneral: number;
  imagenes: Array<{ id: number; url: string }>; // [ { id, url: "/uploads/archivo.png" } ]
}

@Component({
  selector: 'app-mipyme-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mipyme-panel.component.html',
  styleUrls: ['./mipyme-panel.component.css']
})
export class MipymePanelComponent implements OnInit {
  private productService = inject(ProductService);

  // URL base de tu API
  apiUrl = 'http://localhost:3000';

  products: MyProduct[] = [];
  loading = false;
  error: string | null = null;

  // Resúmenes
  totalProducts = 0;
  lowStockCount = 0;
  totalInventoryValue = 0;
  averagePrice = 0;

  ngOnInit() {
    this.loading = true;
    this.productService.getMyProducts().subscribe({
      next: (list: MyProduct[]) => {
        this.products = list;
        this.totalProducts = list.length;
        this.lowStockCount = list.filter(p => p.stock <= 5).length;

        this.totalInventoryValue = list.reduce(
          (sum, p) => sum + p.stock * p.precioGeneral,
          0
        );

        this.averagePrice =
          list.length > 0
            ? parseFloat(
                (
                  list.reduce((sum, p) => sum + p.precioGeneral, 0) / list.length
                ).toFixed(2)
              )
            : 0;

        this.loading = false;
      },
      error: err => {
        console.error('Error cargando mis productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      }
    });
  }

  onImgError(event: Event) {
    const imgEl = event.target as HTMLImageElement;
    imgEl.src = '/assets/no-image.png';
  }
}
