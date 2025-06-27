
import type { InventoryItem } from '@/types/pos';
import { allProductsFlat } from './products';

const suppliers = ['Green Thumb Gardens', 'CaliGrowers', 'Rocky Mountain Highs', 'Coastal Cultivators'];
const INVENTORY_STORAGE_KEY = 'silzeyPosInventory';


export const generateMockInventory = (): InventoryItem[] => {
  // Attempt to load from localStorage first
  const storedInventoryRaw = typeof window !== 'undefined' ? localStorage.getItem(INVENTORY_STORAGE_KEY) : null;
  if (storedInventoryRaw) {
    try {
      const storedInventory = JSON.parse(storedInventoryRaw);
      // Basic validation to ensure it's an array of what we expect
      if (Array.isArray(storedInventory) && storedInventory.length > 0 && 'salePrice' in storedInventory[0]) {
        return storedInventory;
      }
    } catch (e) {
      console.error("Failed to parse stored inventory, regenerating.", e);
    }
  }

  // If nothing in storage or parsing fails, generate fresh mock data
  const freshInventory = allProductsFlat.map((product, index) => ({
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
  }));
  
  // Save the freshly generated data to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(freshInventory));
  }
  
  return freshInventory;
};

export const saveInventory = (inventory: InventoryItem[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    }
}
