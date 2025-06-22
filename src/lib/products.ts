import type { Product } from "@/types/product";

const productImages: Record<string, string[]> = {
  'Pre-rolls': [
    'https://images.unsplash.com/photo-1599425883628-76503c3fc6a3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620343383988-2d886566c7f8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609252811124-5e4548483542?q=80&w=600&auto=format&fit=crop',
  ],
  'Flower': [
    'https://images.unsplash.com/photo-1616694639036-935c75a45270?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608929033586-9a2373e0f735?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631557813531-1f3162a8c326?q=80&w=600&auto=format&fit=crop',
  ],
  'Seeds': [
      'https://images.unsplash.com/photo-1615485925348-523495b3a328?q=80&w=600&auto=format&fit=crop'
  ],
  'Edibles': [
    'https://images.unsplash.com/photo-1620573934390-33759a2c358f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615392415951-54641c8888a7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619154381226-5a4a5842d504?q=80&w=600&auto=format&fit=crop',
  ],
  'Concentrates': [
    'https://images.unsplash.com/photo-1642289452813-912b3236a53b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622046420552-788094d45c55?q=80&w=600&auto=format&fit=crop',
  ],
  'Tinctures': [
      'https://images.unsplash.com/photo-1631094034889-8669b3252f41?q=80&w=600&auto=format&fit=crop'
  ],
  'Topicals': [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop' // Generic cream
  ],
  'Vapes': [
    'https://images.unsplash.com/photo-1624503254922-d38ccf75471d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611294612375-a8c67921010b?q=80&w=600&auto=format&fit=crop',
  ],
  'Gear': [
      'https://images.unsplash.com/photo-1593033875791-0d33887c4f4b?q=80&w=600&auto=format&fit=crop'
  ],
  'Deals': [
    'https://images.unsplash.com/photo-1579586337278-35d9addb018b?q=80&w=600&auto=format&fit=crop' // sale tag
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
