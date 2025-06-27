
import type { InventoryItem } from '@/types/pos';
import { allProductsFlat } from './products';

const suppliers = ['Green Thumb Gardens', 'CaliGrowers', 'Rocky Mountain Highs', 'Coastal Cultivators'];

export const generateMockInventory = (): InventoryItem[] => {
  return allProductsFlat.map((product, index) => ({
    id: product.id,
    name: product.name,
    sku: `SKU-${String(product.id).padStart(5, '0').slice(-5)}`,
    category: product.category,
    supplier: suppliers[index % suppliers.length],
    stock: product.stock ?? 0,
    salePrice: product.price ?? 0,
  }));
};
