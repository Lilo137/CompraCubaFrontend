// publicar-producto.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from './../../features/mipyme/services/product.service';

@Component({
  selector: 'app-publicar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './publicar-producto.component.html',
  styleUrls: ['./publicar-producto.component.css']
})
export class PublicarProductoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  productoForm!: FormGroup;
  provincias = [
    'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
    'Cienfuegos', 'Villa Clara', 'Sancti Spíritus', 'Ciego de Ávila',
    'Camagüey', 'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba',
    'Guantánamo', 'Isla de la Juventud'
  ];
  submitted = false;

  ngOnInit() {
    const provinciaCtrls = this.provincias.reduce((acc, prov) => {
      acc[prov] = new FormControl(null, Validators.min(0));
      return acc;
    }, {} as Record<string, FormControl>);

    this.productoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      precioGeneral: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(1)]],
      imagenes: [[], Validators.required],
      preciosPorProvincia: this.fb.group(provinciaCtrls)
    });
  }

  get formControls() {
    return this.productoForm.controls;
  }

  publicar() {
    this.submitted = true;
    console.log('[Publicar] formulario válido?', this.productoForm.valid, this.productoForm.value);

    if (this.productoForm.invalid) {
      return;
    }

    this.productService.publicarProducto(this.productoForm.value).subscribe({
      next: res => {
        console.log('[Publicar] respuesta del servidor:', res);
        alert('Producto publicado con éxito!');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('[Publicar] error al publicar:', err);
        alert(`Error al publicar el producto: ${err.message}`);
      }
    });
  }
}




  