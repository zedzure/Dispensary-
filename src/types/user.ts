
import type { Order, Receipt, Review } from './pos';
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string; // Changed to string for serialization
  role: 'user' | 'budtender' | 'admin';
  points: number;
  followersCount: number;
  followingCount: number;
  following?: string[];
  orderHistory?: Order[];
  tierHistory?: { tier: string; achievedAt: string }[];
  bio?: string;

  location?: {
      city: string;
      state: string;
      country: string;
      coordinates: { lat: number; lng: number }
  };
  
  preferences?: {
      favoriteStrains: string[];
      preferredProducts: string[];
      notifications: boolean;
  };
  
  dashboard?: {
      points: number;
      tier: string;
      nextTier: string;
      pointsToNextTier: number;
      badges: string[];
      rewardsUnlocked: string[];
  };

  activity?: {
    lastLogin: string;
    joined: string;
  };
  
  // Fields for storage management
  storageLimit: number;
  usedStorage: number;
}
