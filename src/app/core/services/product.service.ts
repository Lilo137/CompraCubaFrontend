// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  /** Obtiene todos los productos (con todas sus imágenes + precios) */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`);
  }

  /** Obtiene solo los productos creados por la mipyme autenticada */
  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/my-products`);
  }

  /**
   * Crea un producto nuevo.
   * Le pasamos un FormData que contenga:
   *  - name, description, categoria, precioGeneral, stock, preciosPorProvincia (string JSON)
   *  - fotos en campos 'imagenes'
   */
  createProduct(fd: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, fd);
  }

  /** Actualiza stock de un producto existente */
  updateStock(productId: number, nuevoStock: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${productId}/stock`, { stock: nuevoStock });
  }

  /** Elimina un producto + sus imágenes y precios */
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  /** Agrega nuevas imágenes a un producto **existente** */
  addImagesToProduct(productId: number, fd: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/${productId}/images`, fd);
  }

  /** Elimina una imagen específica de un producto */
  deleteImage(productId: number, imageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}/images/${imageId}`);
  }
}
