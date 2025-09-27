
import type { UserProfile } from '@/types/pos';
import { realImageUrls } from './products';
import { generateInitialMockOrders } from './mockOrderData';

const kimProfile: UserProfile = {
    id: `CUST-1000`,
    firstName: 'Kim',
    lastName: 'Possible',
    email: `kim@example.com`,
    memberSince: new Date().toISOString(),
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    dataAiHint: 'person face',
    orderHistory: [],
    points: 1000,
    nextReward: 1500,
    tier: 'Platinum',
    nextTier: 'Diamond',
    pointsToNextTier: 500,
    followers: [],
    following: [],
    reviewsToday: 2,
    receiptsThisWeek: 3,
};

export const mockCustomers: UserProfile[] = [
    kimProfile,
    ...Array.from({ length: 25 }, (_, i) => {
    const firstNames = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    
    const memberSince = new Date();
    memberSince.setDate(memberSince.getDate() - (i * 15 + 5));
    
    const orders = generateInitialMockOrders().filter(o => o.customerName === `${'${firstName}'} ${'${lastName}'}`);

    return {
        id: `CUST-${1001 + i}`,
        firstName: firstName,
        lastName: lastName,
        email: `${'${firstName.toLowerCase()}'}.${'${lastName.toLowerCase()}'}@example.com`,
        memberSince: memberSince.toISOString(),
        avatarUrl: realImageUrls[i % realImageUrls.length],
        dataAiHint: 'person face',
        orderHistory: orders,
        points: Math.floor(Math.random() * 500),
        nextReward: 500,
        tier: i % 3 === 0 ? 'Gold' : (i % 3 === 1 ? 'Silver' : 'Bronze'),
        nextTier: i % 3 === 0 ? 'Platinum' : (i % 3 === 1 ? 'Gold' : 'Silver'),
        pointsToNextTier: Math.floor(Math.random() * 200) + 50,
        followers: Array.from({length: Math.floor(Math.random() * 50)}, () => ''),
        following: Array.from({length: Math.floor(Math.random() * 50)}, () => ''),
        reviewsToday: Math.floor(Math.random() * 3),
        receiptsThisWeek: Math.floor(Math.random() * 5),
    };
})
];
