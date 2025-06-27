
import type { Order, OrderStatus } from '@/types/pos';
import { allProductsFlat } from './products';

const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const statuses: OrderStatus[] = ['Completed', 'Shipped', 'Cancelled', 'In-Store'];
const paymentMethods = ['Visa **** 4242', 'Mastercard **** 5555', 'ACH Transfer', 'Cash'];

const getRandomItems = (): { items: Order['items'], itemCount: number, totalAmount: number } => {
    const items: Order['items'] = [];
    let itemCount = 0;
    let totalAmount = 0;
    const numItems = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numItems; i++) {
        const product = allProductsFlat[Math.floor(Math.random() * allProductsFlat.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = product.price ?? 0;

        items.push({
            ...product,
            price: price,
            quantity: quantity,
        });

        itemCount += quantity;
        totalAmount += price * quantity;
    }
    return { items, itemCount, totalAmount };
};


export const generateInitialMockOrders = (): Order[] => {
    return Array.from({ length: 25 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i * 2);
        const { items, itemCount, totalAmount } = getRandomItems();

        return {
            id: `ORD-${String(1000 + i).padStart(4, '0')}`,
            customerName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
            customerId: `CUST${String(101 + i).padStart(3, '0')}`,
            orderDate: date.toISOString(),
            status: statuses[i % statuses.length],
            itemCount,
            items,
            totalAmount,
            shippingAddress: '123 Main St, Anytown, USA 12345',
            paymentMethod: paymentMethods[i % paymentMethods.length],
            submittedByPOS: false,
        };
    });
};
