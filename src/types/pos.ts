
import type { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
}

export type Category = "Flower" | "Concentrates" | "Vapes" | "Edibles" | "Pre-rolls" | "Medical" | "Tinctures" | "Topicals" | "Gear" | "Deals";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string; // ISO String
  avatarUrl: string;
  dataAiHint?: string;
  orderHistory?: Order[];
}

export interface CustomerMetrics extends UserProfile {
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  preferredCategories: { category: Category; count: number }[];
  lastOrderDate?: Date;
}


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
  lowStockThreshold: number;
  purchasePrice: number;
  salePrice: number;
  rating: number;
  tags?: string; // Comma-separated
  notes?: string;
  lastRestockDate: string; // ISO String
  image: string;
  hint: string;
  description: string;
  active: boolean;
}


export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface TransactionItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface ReelConfigItem {
  inventoryItemId: string;
  badgeType: string;
  pulsatingBorder: boolean;
}

export interface TransactionType {
  id: string;
  originalOrderId: string;
  originalOrderType: 'order';
  customer: string;
  date: string; // ISO string
  amount: string; // e.g., '$75.50'
  status: TransactionStatus;
  items: TransactionItem[];
}
