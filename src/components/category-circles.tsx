
import Image from 'next/image';
import type { Product } from '@/types/product';

const categories = [
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

interface CategoryCirclesProps {
  onProductClick: (product: Product) => void;
}

export function CategoryCircles({ onProductClick }: CategoryCirclesProps) {
  const handleClick = (category: { name: string; hint: string }) => {
    const representativeProduct: Product = {
      id: `cat-${category.name.toLowerCase().replace(' ', '-')}`,
      name: `Featured ${category.name}`,
      category: category.name,
      type: 'Hybrid',
      thc: 20,
      price: 45.00,
      description: `A fine selection of our best ${category.name.toLowerCase()}. Click 'Add to Cart' to explore similar products from this category.`,
      image: `https://placehold.co/600x400.png`,
      hint: category.hint,
    };
    onProductClick(representativeProduct);
  };

  return (
    <div className="flex -mx-4 px-4 space-x-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button key={category.name} onClick={() => handleClick(category)} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 group text-center focus:outline-none">
            <div className="relative w-[98px] h-[98px] transition-all duration-300">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
              <div className="absolute inset-0.5 bg-card rounded-full"></div>
              <div className="absolute inset-1 rounded-full overflow-hidden">
                <Image
                    src={`https://placehold.co/90x90.png`}
                    data-ai-hint={category.hint}
                    alt={category.name}
                    width={90}
                    height={90}
                    className="object-cover"
                />
              </div>
            </div>
            <p className="text-xs font-medium text-foreground">{category.name}</p>
          </button>
        ))}
    </div>
  );
}
