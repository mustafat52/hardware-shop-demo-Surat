export type Variant = string;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  variants: Variant[];
  imageUrl?: string;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  variant: Variant | null;
  price: number;
  qty: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  paid: boolean;
  createdAt: number;
  paidAt: number | null;
}