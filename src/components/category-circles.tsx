
import Image from 'next/image';
import type { Product } from '@/types/product';
import { categories } from '@/lib/products';

interface CategoryCirclesProps {
  onProductClick: (product: Product) => void;
}

export function CategoryCircles({ onProductClick }: CategoryCirclesProps) {
  const handleClick = (category: typeof categories[0]) => {
    const representativeProduct: Product = {
      id: `cat-${category.name.toLowerCase().replace(' ', '-')}`,
      name: `Featured ${category.name}`,
      category: category.name,
      type: 'Hybrid',
      thc: 20,
      price: 45.00,
      description: `A fine selection of our best ${category.name.toLowerCase()}. Click 'Add to Cart' to explore similar products from this category.`,
      image: category.image,
      hint: category.hint,
    };
    onProductClick(representativeProduct);
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex px-4 md:px-6 space-x-4 pb-4">
          {categories.map((category) => (
            <button key={category.name} onClick={() => handleClick(category)} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 group text-center focus:outline-none">
              <div className="relative w-[98px] h-[98px] transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                <div className="absolute inset-0.5 bg-card rounded-full"></div>
                <div className="absolute inset-1 rounded-full overflow-hidden">
                  <Image
                      src={category.image}
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
    </div>
  );
}
