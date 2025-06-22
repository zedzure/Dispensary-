import type { Product } from "@/types/product";

export const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint' },
  { name: 'Flower', hint: 'cannabis bud' },
  { name: 'Seeds', hint: 'cannabis seed' },
  { name: 'Edibles', hint: 'gummy candy' },
  { name: 'Concentrates', hint: 'cannabis oil' },
  { name: 'Tinctures', hint: 'dropper bottle' },
  { name: 'Topicals', hint: 'cream jar' },
  { name: 'Vapes', hint: 'vape pen' },
  { name: 'Gear', hint: 'grinder accessory' },
  { name: 'Deals', hint: 'sale tag' },
];

export const generateProducts = (category: { name: string, hint: string }, count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => {
    const productType = i % 3 === 0 ? 'Sativa' : i % 3 === 1 ? 'Indica' : 'Hybrid';
    let specificHint = category.hint;
    
    if (category.name === 'Flower') {
      specificHint = `${productType.toLowerCase()} cannabis`;
    } else if (productType !== 'Hybrid') {
        if (category.name === 'Vapes') {
            specificHint = `${productType.toLowerCase()} vape`;
        } else if (category.name === 'Pre-rolls') {
            specificHint = `${productType.toLowerCase()} joint`;
        }
    }

    return {
        id: `${category.name}-${i}`,
        name: `${category.name} Product ${i + 1}`,
        category: category.name,
        type: productType,
        thc: ((i * 3) % 15) + 15,
        price: ((i * 7) % 40) + 20,
        description: `An exquisite ${category.name.toLowerCase()} with a unique profile. Perfect for both new and experienced users looking for a quality experience.`,
        image: `https://placehold.co/600x400.png`,
        hint: specificHint,
    };
  });
};

export const allProducts = categories.reduce((acc, category) => {
  acc[category.name] = generateProducts(category, 10);
  return acc;
}, {} as Record<string, Product[]>);

export const allProductsFlat: Product[] = Object.values(allProducts).flat();
