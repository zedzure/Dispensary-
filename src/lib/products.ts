import type { Product } from "@/types/product";

const productImages: Record<string, string[]> = {
  'Pre-rolls': [
    'https://images.pexels.com/photos/7689143/pexels-photo-7689143.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/8340645/pexels-photo-8340645.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7924849/pexels-photo-7924849.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Flower': [
    'https://images.pexels.com/photos/7700269/pexels-photo-7700269.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/9331317/pexels-photo-9331317.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7689148/pexels-photo-7689148.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/8132961/pexels-photo-8132961.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Seeds': [
      'https://images.pexels.com/photos/7700262/pexels-photo-7700262.jpeg?auto=compress&cs=tinysrgb&w=600'
  ],
  'Edibles': [
    'https://images.pexels.com/photos/5743259/pexels-photo-5743259.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/6604803/pexels-photo-6604803.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7258380/pexels-photo-7258380.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Concentrates': [
    'https://images.pexels.com/photos/7689150/pexels-photo-7689150.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/8464977/pexels-photo-8464977.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Tinctures': [
      'https://images.pexels.com/photos/7667732/pexels-photo-7667732.jpeg?auto=compress&cs=tinysrgb&w=600'
  ],
  'Topicals': [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600' // Generic cream
  ],
  'Vapes': [
    'https://images.pexels.com/photos/8340640/pexels-photo-8340640.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/8340656/pexels-photo-8340656.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Gear': [
      'https://images.pexels.com/photos/8132959/pexels-photo-8132959.jpeg?auto=compress&cs=tinysrgb&w=600'
  ],
  'Deals': [
    'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600' // sale tag
  ]
};

export const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint', image: productImages['Pre-rolls'][0] },
  { name: 'Flower', hint: 'cannabis bud', image: productImages['Flower'][0] },
  { name: 'Seeds', hint: 'cannabis seed', image: productImages['Seeds'][0] },
  { name: 'Edibles', hint: 'gummy candy', image: productImages['Edibles'][0] },
  { name: 'Concentrates', hint: 'cannabis oil', image: productImages['Concentrates'][0] },
  { name: 'Tinctures', hint: 'dropper bottle', image: productImages['Tinctures'][0] },
  { name: 'Topicals', hint: 'cream jar', image: productImages['Topicals'][0] },
  { name: 'Vapes', hint: 'vape pen', image: productImages['Vapes'][0] },
  { name: 'Gear', hint: 'grinder accessory', image: productImages['Gear'][0] },
  { name: 'Deals', hint: 'sale tag', image: productImages['Deals'][0] },
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

    const imagesForCategory = productImages[category.name] || productImages['Flower'];
    const imageUrl = imagesForCategory[i % imagesForCategory.length];

    return {
        id: `${category.name}-${i}`,
        name: `${category.name} Product ${i + 1}`,
        category: category.name,
        type: productType,
        thc: ((i * 3) % 15) + 15,
        price: ((i * 7) % 40) + 20,
        description: `An exquisite ${category.name.toLowerCase()} with a unique profile. Perfect for both new and experienced users looking for a quality experience.`,
        image: imageUrl,
        hint: specificHint,
    };
  });
};

export const allProducts = categories.reduce((acc, category) => {
  acc[category.name] = generateProducts(category, 10);
  return acc;
}, {} as Record<string, Product[]>);

export const allProductsFlat: Product[] = Object.values(allProducts).flat();
