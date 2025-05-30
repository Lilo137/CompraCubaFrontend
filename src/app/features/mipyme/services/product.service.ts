import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CreateProductDto } from '../models/create-product.dto';  // define esta interfaz
import { Product } from '../../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  publicarProducto(data: CreateProductDto): Observable<any> {
    const token = this.auth.token;
    return this.http.post<any>(
      this.baseUrl,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`);
  }
}