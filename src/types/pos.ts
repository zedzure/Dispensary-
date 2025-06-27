
import type { Product } from './product';

// Omit price and stock from Product to redefine price, and stock is not needed here.
export interface OrderItem extends Omit<Product, 'price' | 'stock'> {
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  orderDate: string; // ISO string
  itemCount: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending Checkout' | 'In-Store' | 'Completed' | 'Cancelled';
  processedAt?: string; // ISO string
}
