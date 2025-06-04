import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { HttpClient } from '@angular/common/http';

interface ImagenSimple {
  id: number;
  url: string;      // ej: "/uploads/archivo.png"
  productId: number;
}

export interface MyProduct {
  id: number;
  name: string;
  categoria: string;
  description: string;
  stock: number;
  precioGeneral: number;
  imagenes: ImagenSimple[];
}

@Component({
  selector: 'app-mipyme-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mipyme-products.component.html',
  styleUrls: ['./mipyme-products.component.css'],
})
export class MipymeProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  /** URL base de la API */
  apiUrl = 'http://localhost:3000';

  products: MyProduct[] = [];
  loading = false;
  error: string | null = null;

  // ---- Para creación de nuevo producto ----
  showNewForm = false;
  productForm!: FormGroup;
  previewNewImages: string[] = [];
  selectedFiles: File[] = [];

  // ---- Para edición de producto ----
  editingProduct: MyProduct | null = null;
  editForm!: FormGroup;
  previewNewImagesEdit: string[] = [];
  selectedFilesEdit: File[] = [];

  // Lista de categorías fijas
  categories: string[] = [
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
    // 1) Inicializar formulario de creación
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      precioGeneral: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      imagenes: [[] as ImagenSimple[]] // placeholder interno
    });

    // 2) Inicializar formulario de edición (solo campos editables: stock y agregar imágenes)
    this.editForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      precioGeneral: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required]
    });

    // 3) Cargar productos existentes
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getMyProducts().subscribe({
      next: (list: MyProduct[]) => {
        this.products = list;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      },
    });
  }

  toggleNewForm() {
    this.showNewForm = !this.showNewForm;
    this.productForm.reset({
      name: '',
      description: '',
      stock: 0,
      precioGeneral: 0,
      categoria: ''
    });
    this.previewNewImages = [];
    this.selectedFiles = [];
  }

  onFilesSelected(event: any) {
    this.previewNewImages = [];
    this.selectedFiles = [];
    const archivos: FileList = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewNewImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  createProduct() {
    if (this.productForm.invalid) return;
    const fv = this.productForm.value;
    const formData = new FormData();

    formData.append('name', fv.name);
    formData.append('description', fv.description);
    formData.append('categoria', fv.categoria);
    formData.append('precioGeneral', fv.precioGeneral.toString());
    formData.append('stock', fv.stock.toString());
    // ✅ Siempre enviar preciosPorProvincia aunque sea vacío
    formData.append('preciosPorProvincia', '[]');

    // Agregar cada archivo seleccionado como “imagenes” en el FormData
    for (const file of this.selectedFiles) {
      formData.append('imagenes', file);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.toggleNewForm();
        this.loadProducts();
      },
      error: (err) => console.error('Error creando producto:', err),
    });
  }

  startEdit(p: MyProduct) {
    this.editingProduct = p;
    this.editForm.patchValue({
      id: p.id,
      name: p.name,
      description: p.description,
      stock: p.stock,
      precioGeneral: p.precioGeneral,
      categoria: p.categoria
    });
    this.previewNewImagesEdit = [];
    this.selectedFilesEdit = [];
  }

  onFilesSelectedEdit(event: any) {
    this.previewNewImagesEdit = [];
    this.selectedFilesEdit = [];
    const archivos: FileList = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i];
      this.selectedFilesEdit.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewNewImagesEdit.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onDeleteImage(productId: number, imageId: number) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    this.productService.deleteImage(productId, imageId).subscribe({
      next: () => {
        // Actualizar la lista local de imágenes sin recargar todo
        if (this.editingProduct) {
          this.editingProduct.imagenes = this.editingProduct.imagenes.filter(
            (img) => img.id !== imageId
          );
        }
      },
      error: (err) => console.error('Error eliminando imagen:', err),
    });
  }

  updateProduct() {
    if (this.editForm.invalid || !this.editingProduct) return;
    const val = this.editForm.value;

    // 1) Actualizamos stock primero (PATCH /products/:id/stock)
    this.productService
      .updateStock(this.editingProduct.id, val.stock)
      .subscribe({
        next: () => {
          // 2) Si hay nuevas imágenes, las subimos (POST /products/:id/images)
          if (this.selectedFilesEdit.length > 0) {
            const formData = new FormData();
            for (const file of this.selectedFilesEdit) {
              formData.append('imagenes', file);
            }
            this.productService
              .addImagesToProduct(this.editingProduct!.id, formData)
              .subscribe({
                next: () => {
                  this.cancelEdit();
                  this.loadProducts();
                },
                error: (err) =>
                  console.error('Error subiendo nuevas imágenes:', err),
              });
          } else {
            // Si no hay nuevas imágenes, solo recargamos la lista
            this.cancelEdit();
            this.loadProducts();
          }
        },
        error: (err) => console.error('Error actualizando stock:', err),
      });
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editForm.reset({
      id: null,
      name: '',
      description: '',
      stock: 0,
      precioGeneral: 0,
      categoria: ''
    });
    this.previewNewImagesEdit = [];
    this.selectedFilesEdit = [];
  }

  deleteProduct(id: number) {
    if (!confirm('¿Confirmas que deseas eliminar este producto?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => console.error('Error eliminando:', err),
    });
  }

  /** Si alguna miniatura no carga, mostramos el placeholder local */
  onImgError(event: any) {
    event.target.src = '/assets/no-image.png';
  }
}
