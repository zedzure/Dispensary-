
import type { Order, Receipt } from '@/types/pos';
import { allProductsFlat } from '@/lib/products';
import { mockCustomers } from './mockCustomers';

const kenyaUser = mockCustomers.find(c => c.firstName === 'Kenya');
const kenyaUserId = kenyaUser ? kenyaUser.id : 'lUmPteemHpOpawyOoQmMv9w73ql1';


export const mockReceiptsData: Receipt[] = [
  {
    id: 'receipt-1',
    userId: kenyaUserId,
    imageUrl: 'https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg',
    totalAmount: 54.20,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
    pointsAwarded: 54,
    userName: 'Kenya Mccullough',
    userAvatar: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'receipt-2',
    userId: kenyaUserId,
    imageUrl: 'https://images.pexels.com/photos/7773109/pexels-photo-7773109.jpeg',
    totalAmount: 120.50,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'pending',
    userName: 'Kenya Mccullough',
    userAvatar: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'receipt-3',
    userId: kenyaUserId,
    imageUrl: 'https://images.pexels.com/photos/7667739/pexels-photo-7667739.jpeg',
    totalAmount: 75.00,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'rejected',
    userName: 'Kenya Mccullough',
    userAvatar: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
  }
];


export const generateInitialMockOrders = (): Order[] => {
  // Now returns an empty array, as this should be fetched from a backend
  return [];
};
