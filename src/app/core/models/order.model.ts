// src/app/core/models/order.model.ts

export interface OrderProduct {
  productId: number;
  cantidad: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

export interface Order {
  id: number;
  userID: number;
  total: number;
  createdAt: string; // Viene del backend
  user: {
    id: number;
    username: string;
  };
  products: OrderProduct[];
}
