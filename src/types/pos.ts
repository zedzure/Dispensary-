
import type { Product } from './product';
import type { Timestamp } from 'firebase/firestore';

export interface Review {
    id: string; // reviewId
    userId: string; // uid
    targetId: string; // e.g., dispensaryId
    targetType: 'dispensary' | 'product';
    rating: number;
    text: string;
    photos?: string[]; // URLs to images in Storage
    likesCount?: number;
    commentsCount?: number;
    createdAt: Timestamp | string;
    updatedAt?: Timestamp | string;
    // For display purposes, denormalized
    user: {
        name: string;
        avatar: string;
    };
    followers?: number;
}

export interface ReviewComment {
    id: string; // commentId
    userId: string;
    text: string;
    createdAt: Timestamp;
     user?: {
        name: string;
        avatar: string;
    };
}


export interface Dispensary {
    id: string;
    name: string;
    logo: string;
    hint: string;
    rating: string;
    deliveryTime: number;
    address: string;
    state: string;
    hours: string;
    lat: number;
    lng: number;
    reviews?: Review[];
}

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
  points?: number;
  nextReward?: number;
  bio?: string;
  followers?: string[];
  following?: string[];
  reviewsToday?: number;
  receiptsThisWeek?: number;
  followersCount?: number;
  followingCount?: number;
  tier?: string;
  nextTier?: string;
  pointsToNextTier?: number;
}

export interface CustomerMetrics extends UserProfile {
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  preferredCategories: { category: Category; count: number }[];
  lastOrderDate?: Date;
}


export interface OrderItem extends Omit<Product, 'stock'> {
  quantity: number;
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
  active: boolean;
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

export interface MarketplaceLocation {
    id: string;
    name: string;
    state: string;
}

export interface Receipt {
    id: string; // receiptId
    userId: string;
    imageUrl: string; // Path in Firebase Storage
    totalAmount: number;
    createdAt: string; // ISO String
    status: 'pending' | 'approved' | 'rejected';
    pointsAwarded?: number;
     // Denormalized for display
    userName?: string;
    userAvatar?: string;
}

export interface PointsTransaction {
    id: string; // txId
    userId: string;
    delta: number; // e.g., 10 or -200
    reason: 'review:create' | 'receipt:approve' | 'follow:new' | 'reward:redeem';
    refType: 'review' | 'receipt' | 'user' | 'reward';
    refId: string; // ID of the source document
    createdAt: Timestamp;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
  text: string;
  timestamp: Timestamp | string; // ISO string
  likes: number;
  isLiked: boolean; // Client-side state
  imageUrl?: string;
  replyingTo?: {
    user: string;
    text: string;
  };
}

export interface UploadItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Timestamp | string;
}
