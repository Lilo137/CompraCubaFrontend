// src/app/features/mipyme/models/create-product.dto.ts
import { ImagenDto } from './imagen.dto';
import { PrecioProvinciaDto } from './precio-provincia.dto';

export interface CreateProductDto {
  name: string;
  description: string;
  precioGeneral: number;
  stock: number;
  imagenes: ImagenDto[];
  preciosPorProvincia: PrecioProvinciaDto[];
}
