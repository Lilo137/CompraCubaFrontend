// src/app/core/models/product.model.ts

// Cada imagen tiene un ID, una URL (p. ej. '/uploads/xxxx.png') y productId
export interface ImagenSimple {
  id: number;
  url: string;
  productId: number;
}

// Precio por provincia (de cada producto)
export interface PrecioProvincia {
  id?: number;
  provincia: string;
  precio: number;
  productId: number;
}

// Modelo Product (tal como lo devuelve el backend)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;       // en BD se llama 'price'
  stock: number;
  imageUrl: string;    // url primaria (p. ej. '/uploads/foo.png') o cadena vacía
  categoria: string;
  precioGeneral: number;
  publicadoPor: number;
  createdAt: string;
  updatedAt: string;
  imagenes: ImagenSimple[];       // array de todas las imágenes
  precios: PrecioProvincia[];     // array de precios por provincia
}
