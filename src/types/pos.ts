
import type { Product } from './product';

// Omit price and stock from Product to redefine price, and stock is not needed here.
export interface OrderItem extends Omit<Product, 'price' | 'stock'> {
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending Checkout' | 'In-Store' | 'Completed' | 'Shipped' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  orderDate: string; // ISO string
  itemCount: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  processedAt?: string; // ISO string
  shippingAddress?: string;
  paymentMethod?: string;
  submittedByPOS?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  stock: number;
  salePrice: number;
}
