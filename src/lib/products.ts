
import type { Product } from "@/types/product";
import { generateProducts, categories, realImageUrls } from './product-generator';

export { categories, realImageUrls };

export const allProducts: Record<string, Product[]> = categories.reduce((acc, category) => {
  acc[category.name] = generateProducts(category, 15);
  return acc;
}, {} as Record<string, Product[]>);


export const allProductsFlat: Product[] = Object.values(allProducts).flat();
