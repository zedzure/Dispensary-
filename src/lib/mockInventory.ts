
import type { InventoryItem } from '@/types/pos';
import { allProductsFlat } from './products';

const suppliers = ['Green Thumb Gardens', 'CaliGrowers', 'Rocky Mountain Highs', 'Coastal Cultivators'];
const INVENTORY_STORAGE_KEY = 'silzeyPosInventory';


export const generateMockInventory = (): InventoryItem[] => {
  const storedInventoryRaw = typeof window !== 'undefined' ? localStorage.getItem(INVENTORY_STORAGE_KEY) : null;
  if (storedInventoryRaw) {
    try {
      const storedInventory = JSON.parse(storedInventoryRaw);
      if (Array.isArray(storedInventory) && storedInventory.length > 0 && 'purchasePrice' in storedInventory[0]) {
        return storedInventory;
      }
    } catch (e) {
      console.error("Failed to parse stored inventory, regenerating.", e);
    }
  }

  const freshInventory = allProductsFlat.map((product, index) => {
    const lastRestock = new Date();
    lastRestock.setDate(lastRestock.getDate() - (index % 30));
    
    return {
      id: product.id,
      name: product.name,
      sku: `SKU-${String(product.id).padStart(5, '0').slice(-5)}`,
      category: product.category,
      supplier: suppliers[index % suppliers.length],
      stock: product.stock ?? 0,
      salePrice: product.price ?? 0,
      image: product.image,
      hint: product.hint,
      description: product.description,
      // New fields
      lowStockThreshold: 20,
      purchasePrice: (product.price ?? 0) * (Math.random() * 0.2 + 0.5), // 50-70% of sale price
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      tags: index % 3 === 0 ? 'Best Seller' : (index % 5 === 0 ? 'New Arrival,Organic' : 'Staff Pick'),
      notes: index % 7 === 0 ? `Received new shipment on ${new Date().toLocaleDateString()}. Watch for discoloration.` : '',
      lastRestockDate: lastRestock.toISOString(),
    };
  });
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(freshInventory));
  }
  
  return freshInventory;
};

export const saveInventory = (inventory: InventoryItem[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    }
};
