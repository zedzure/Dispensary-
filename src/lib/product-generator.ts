
import type { Product } from "@/types/product";

const placeholderHint = 'cannabis product';

export const realImageUrls: string[] = [
    "https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7773109/pexels-photo-7773109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667739/pexels-photo-7667739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667711/pexels-photo-7667711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/8139067/pexels-photo-8139067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667727/pexels-photo-7667727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667746/pexels-photo-7667746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667717/pexels-photo-7667717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667729/pexels-photo-7667729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7938367/pexels-photo-7938367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667723/pexels-photo-7667723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7733470/pexels-photo-7733470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/8139676/pexels-photo-8139676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667726/pexels-photo-7667726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667718/pexels-photo-7667718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/7667742/pexels-photo-7667742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

export const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint', image: 'https://images.pexels.com/photos/8139067/pexels-photo-8139067.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Flower', hint: 'cannabis bud', image: 'https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Medical', hint: 'medical cannabis', image: 'https://images.pexels.com/photos/7667711/pexels-photo-7667711.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Edibles', hint: 'gummy candy', image: 'https://images.pexels.com/photos/7667727/pexels-photo-7667727.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Concentrates', hint: 'cannabis oil', image: 'https://images.pexels.com/photos/7667746/pexels-photo-7667746.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Tinctures', hint: 'dropper bottle', image: 'https://images.pexels.com/photos/7667717/pexels-photo-7667717.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Topicals', hint: 'cream jar', image: 'https://images.pexels.com/photos/7667723/pexels-photo-7667723.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Vapes', hint: 'vape pen', image: 'https://images.pexels.com/photos/8464972/pexels-photo-8464972.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Gear', hint: 'grinder accessory', image: 'https://images.pexels.com/photos/7938367/pexels-photo-7938367.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Deals', hint: 'sale tag', image: 'https://images.pexels.com/photos/7733470/pexels-photo-7733470.jpeg?auto=compress&cs=tinysrgb&w=400' },
];


export const generateProducts = (category: { name: string, hint: string, image: string }, count: number): Product[] => {
  const products: Product[] = [];
  const productNames = [
    'OG Kush', 'Blue Dream', 'Sour Diesel', 'Girl Scout Cookies', 'Granddaddy Purple',
    'White Widow', 'Jack Herer', 'Northern Lights', 'Pineapple Express', 'AK-47',
    'Bubba Kush', 'Durban Poison', 'Chemdawg', 'Green Crack', 'Maui Wowie'
  ];

  for (let i = 0; i < count; i++) {
    const name = `${productNames[i % productNames.length]} ${category.name}`;
    products.push({
      id: `${category.name.slice(0,3).toUpperCase()}${i}`,
      name: name,
      category: category.name,
      type: i % 3 === 0 ? 'Sativa' : i % 3 === 1 ? 'Indica' : 'Hybrid',
      thc: Math.floor(Math.random() * 15) + 15,
      price: Math.floor(Math.random() * 40) + 20,
      description: `A popular ${category.name.toLowerCase()} with a distinct aroma. Known for its potent effects and smooth experience. Perfect for both new and experienced users.`,
      image: realImageUrls[i % realImageUrls.length],
      hint: category.hint || placeholderHint,
      stock: Math.floor(Math.random() * 100),
      active: true,
      rating: +(4 + Math.random()).toFixed(1),
    });
  }
  return products;
};
