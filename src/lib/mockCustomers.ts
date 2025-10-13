
import type { UserProfile } from '@/types/pos';
import { realImageUrls } from './products';
import { generateInitialMockOrders } from './mockOrderData';

const kimProfile: UserProfile = {
    id: 'p9ZjS1zAbTWrxryVd1HA1ftUcl32',
    firstName: 'Kim',
    lastName: 'Possible',
    email: `kim@gmail.com`,
    memberSince: new Date().toISOString(),
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    dataAiHint: 'person face',
    orderHistory: [],
    points: 123,
    nextReward: 500,
    bio: `Front-end Developer from <strong>Mesopotamia</strong>`,
    followers: [],
    following: [],
    followersCount: 1598,
    followingCount: 65,
    reviewsToday: 123,
    receiptsThisWeek: 85,
    tier: 'Platinum',
    nextTier: 'Diamond',
    pointsToNextTier: 500,
};

const ronProfile: UserProfile = {
    id: `CUST-1026`,
    firstName: 'Ron',
    lastName: 'Stoppable',
    email: `ron@example.com`,
    memberSince: new Date('2023-01-15').toISOString(),
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    dataAiHint: 'person face',
    orderHistory: [],
    points: 150,
    nextReward: 500,
    tier: 'Bronze',
    nextTier: 'Silver',
    pointsToNextTier: 100,
    followers: [],
    following: [],
    reviewsToday: 0,
    receiptsThisWeek: 1,
};

const shegoProfile: UserProfile = {
    id: `CUST-1027`,
    firstName: 'Shego',
    lastName: '',
    email: `shego@example.com`,
    memberSince: new Date('2022-11-20').toISOString(),
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    dataAiHint: 'person face',
    orderHistory: [],
    points: 5000,
    nextReward: 10000,
    tier: 'Diamond',
    nextTier: 'Diamond',
    pointsToNextTier: 0,
    followers: [],
    following: [],
    reviewsToday: 5,
    receiptsThisWeek: 10,
};

const kenyaProfile: UserProfile = {
    id: 'lUmPteemHpOpawyOoQmMv9w73ql1',
    firstName: 'Kenya',
    lastName: 'Mccullough',
    email: 'kenya.mccullough@example.com',
    memberSince: new Date('2021-08-22').toISOString(),
    avatarUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
    dataAiHint: 'person face',
    orderHistory: [],
    points: 2450,
    nextReward: 3000,
    bio: `Cannabis connoisseur and avid hiker. Exploring the best strains that nature has to offer.`,
    followers: [],
    following: [],
    followersCount: 842,
    followingCount: 123,
    reviewsToday: 7,
    receiptsThisWeek: 3,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 550,
};

export const mockCustomers: UserProfile[] = [
    kimProfile,
    ronProfile,
    shegoProfile,
    kenyaProfile,
    ...Array.from({ length: 25 }, (_, i) => {
    const firstNames = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    
    const memberSince = new Date();
    memberSince.setDate(memberSince.getDate() - (i * 15 + 5));
    
    const orders = generateInitialMockOrders().filter(o => o.customerName === `\${firstName} \${lastName}`);

    return {
        id: `CUST-${1001 + i}`,
        firstName: firstName,
        lastName: lastName,
        email: `\${firstName.toLowerCase()}.\${lastName.toLowerCase()}@example.com`,
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
