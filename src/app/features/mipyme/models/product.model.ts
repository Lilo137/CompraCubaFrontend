export interface Product {
  id: number;
  name: string;
  description: string;
  precioGeneral: number;
  stock: number;
  imageUrl?: string;
  // etc. según tu entidad
}