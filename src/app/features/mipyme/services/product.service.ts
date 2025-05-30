import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../../../src/environment/enviroment';

interface ProvinciaVentas {
  name: string;
  value: number;
}

interface ProductoStock {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/api/mipyme`;

  constructor(private http: HttpClient) {}

  getVentasPorProvincia(): Observable<ProvinciaVentas[]> {
    return this.http.get<ProvinciaVentas[]>(`${this.apiUrl}/ventas/provincia`);
  }

  getStockPorProducto(): Observable<ProductoStock[]> {
    return this.http.get<ProductoStock[]>(`${this.apiUrl}/stock`);
  }

  publicarProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicar`, producto);
  }
}