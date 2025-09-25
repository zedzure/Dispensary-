
import type { InventoryItem } from '@/types/pos';
import { allProductsFlat, categories } from './products';

let cachedInventory: InventoryItem[] | null = null;
const INVENTORY_STORAGE_KEY = 'silzeyPosInventory';

export const generateMockInventory = (): InventoryItem[] => {
  if (typeof window !== 'undefined') {
    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (storedInventory) {
      cachedInventory = JSON.parse(storedInventory);
      return cachedInventory!;
    }
  }

  if (cachedInventory) {
    return cachedInventory;
  }

  cachedInventory = allProductsFlat.map((product, i) => ({
    id: product.id,
    name: product.name,
    sku: `SKU-${product.category.slice(0,3).toUpperCase()}-${1000 + i}`,
    category: product.category,
    supplier: `Supplier ${String.fromCharCode(65 + (i % 5))}`,
    stock: product.stock ?? Math.floor(Math.random() * 100),
    lowStockThreshold: 20,
    purchasePrice: (product.price ?? 20) * 0.5,
    salePrice: product.price ?? 20,
    rating: product.rating ?? 0,
    tags: `${product.type}, ${product.category}`,
    notes: 'Standard quality check passed.',
    lastRestockDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    image: product.image,
    hint: product.hint,
    description: product.description,
    active: product.active ?? true,
  }));
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(cachedInventory));
  }

  return cachedInventory;
};

export const saveInventory = (inventory: InventoryItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    cachedInventory = inventory;
  }
};
