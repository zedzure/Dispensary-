import type { Product } from "@/types/product";

const placeholderImage = 'https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=600';
const placeholderHint = 'cannabis product';

export const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint', image: placeholderImage },
  { name: 'Flower', hint: 'cannabis bud', image: placeholderImage },
  { name: 'Seeds', hint: 'cannabis seeds', image: placeholderImage },
  { name: 'Edibles', hint: 'gummy candy', image: placeholderImage },
  { name: 'Concentrates', hint: 'cannabis oil', image: placeholderImage },
  { name: 'Tinctures', hint: 'dropper bottle', image: placeholderImage },
  { name: 'Topicals', hint: 'cream jar', image: placeholderImage },
  { name: 'Vapes', hint: 'vape pen', image: placeholderImage },
  { name: 'Gear', hint: 'grinder accessory', image: placeholderImage },
  { name: 'Deals', hint: 'sale tag', image: placeholderImage },
];

export const generateProducts = (category: { name: string, hint: string }, count: number): Product[] => {
  const effectKeywords = ['relaxing', 'uplifting', 'energetic', 'focused', 'creative', 'sleepy', 'euphoric', 'happy'];
  const flavorKeywords = ['earthy', 'sweet', 'citrus', 'fruity', 'pine', 'woody', 'spicy', 'herbal'];

  return Array.from({ length: count }).map((_, i) => {
    const productType = i % 3 === 0 ? 'Sativa' : i % 3 === 1 ? 'Indica' : 'Hybrid';
    const randomEffect1 = effectKeywords[i % effectKeywords.length];
    const randomEffect2 = effectKeywords[(i + 3) % effectKeywords.length];
    const randomFlavor1 = flavorKeywords[i % flavorKeywords.length];
    const randomFlavor2 = flavorKeywords[(i + 5) % flavorKeywords.length];
    
    return {
        id: `${category.name}-${i}`,
        name: `${category.name} Product ${i + 1}`,
        category: category.name,
        type: productType,
        thc: ((i * 3) % 15) + 15,
        price: ((i * 7) % 40) + 20,
        description: `An exquisite ${category.name.toLowerCase()} with a unique profile. Known for its ${randomEffect1} and ${randomEffect2} effects, it features a ${randomFlavor1} aroma with notes of ${randomFlavor2}. Perfect for both new and experienced users.`,
        image: placeholderImage,
        hint: category.hint || placeholderHint,
    };
  });
};

export const allProducts = categories.reduce((acc, category) => {
  if (category.name !== 'Coming Soon') {
    acc[category.name] = generateProducts(category, 10);
  }
  return acc;
}, {} as Record<string, Product[]>);

export const allProductsFlat: Product[] = Object.values(allProducts).flat();
