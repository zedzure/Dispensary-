
import type { UserProfile, Order } from '@/types/pos';
import { allProductsFlat } from './products';

const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const avatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
];
const hints = ['man face', 'woman face', 'woman smiling', 'man smiling', 'man portrait'];

const generateMockOrdersForCustomer = (customerId: string, numOrders: number): Order[] => {
    const orders: Order[] = [];
    for (let i = 0; i < numOrders; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90 + i * 5));
        const numItemsInOrder = Math.floor(Math.random() * 4) + 1;
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < numItemsInOrder; j++) {
            const product = allProductsFlat[Math.floor(Math.random() * allProductsFlat.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            const price = product.price ?? 0;
            items.push({ ...product, quantity, price });
            totalAmount += price * quantity;
        }

        orders.push({
            id: `ORD-C${customerId.slice(-2)}I${i}`,
            customerName: '', // Will be filled in later
            customerId: customerId,
            orderDate: date.toISOString(),
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            items: items,
            totalAmount: totalAmount,
            status: 'Completed',
        });
    }
    return orders;
};

export const mockCustomers: UserProfile[] = Array.from({ length: 20 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const customerId = `CUST${String(101 + i).padStart(3, '0')}`;
    const memberSinceDate = new Date();
    memberSinceDate.setDate(memberSinceDate.getDate() - Math.floor(Math.random() * 365));

    const numOrders = Math.floor(Math.random() * 15);
    const orderHistory = generateMockOrdersForCustomer(customerId, numOrders);

    return {
        id: customerId,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        memberSince: memberSinceDate.toISOString(),
        avatarUrl: avatars[i % avatars.length],
        dataAiHint: hints[i % hints.length],
        orderHistory,
    };
});
