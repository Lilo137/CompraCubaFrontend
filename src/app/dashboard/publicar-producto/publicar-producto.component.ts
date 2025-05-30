import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from './../../features/mipyme/services/product.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-publicar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './publicar-producto.component.html',
  styleUrls: ['./publicar-producto.component.css']
})
export class PublicarProductoComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  router = inject(Router); // Público para el template

  productoForm: FormGroup;
  provincias = [
    'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
    'Cienfuegos', 'Villa Clara', 'Sancti Spíritus', 'Ciego de Ávila',
    'Camagüey', 'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba',
    'Guantánamo', 'Isla de la Juventud'
  ];
  submitted = false;

  constructor() {
    this.productoForm = this.fb.group({});
    this.initForm();
  }

  private initForm(): void {
    const provinciaControls = this.provincias.reduce((acc, provincia) => {
      acc[provincia] = this.fb.control('', [Validators.min(0)]);
      return acc;
    }, {} as { [key: string]: FormControl });

    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      imagen: ['', [Validators.required, Validators.pattern('https?://.+')]],
      precioPorProvincia: this.fb.group(provinciaControls)
    });
  }

  get formControls() {
    return this.productoForm.controls;
  }

  get provinciaControls() {
    return (this.productoForm.get('precioPorProvincia') as FormGroup).controls;
  }

  publicar(): void {
    this.submitted = true;
    
    if (this.productoForm.invalid) {
      return;
    }

    this.productService.publicarProducto(this.productoForm.value).subscribe({
      next: () => {
        alert('Producto publicado con éxito!');
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        console.error('Error al publicar:', err);
        alert(`Error al publicar el producto: ${err.message}`);
      }
    });
  }
}