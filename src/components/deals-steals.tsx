
import Image from 'next/image';
import type { Product } from '@/types/product';

const deals = [
  { name: 'Blue Dream', hint: 'sativa cannabis', tag: 'New' },
  { name: 'Sour Diesel', hint: 'sativa cannabis', tag: 'Popular' },
  { name: 'OG Kush', hint: 'hybrid cannabis', tag: '5% Off' },
  { name: 'Granddaddy Purple', hint: 'indica cannabis', tag: 'Just In' },
  { name: 'White Widow', hint: 'hybrid cannabis', tag: '10 Left' },
  { name: 'AK-47', hint: 'hybrid cannabis' },
  { name: 'Jack Herer', hint: 'sativa cannabis', tag: '10% Off' },
  { name: 'Green Crack', hint: 'sativa cannabis' },
  { name: 'Pineapple Express', hint: 'hybrid cannabis', tag: '5 Left' },
  { name: 'Girl Scout Cookies', hint: 'indica cannabis', tag: 'Popular' },
  { name: 'Northern Lights', hint: 'indica cannabis' },
  { name: 'Bubba Kush', hint: 'indica cannabis', tag: 'New' },
  { name: 'Durban Poison', hint: 'sativa cannabis' },
  { name: 'Maui Wowie', hint: 'sativa cannabis', tag: 'Just In' },
  { name: 'Trainwreck', hint: 'hybrid cannabis', tag: '5% Off' },
  { name: 'Chemdawg', hint: 'hybrid cannabis' },
  { name: 'Super Lemon Haze', hint: 'sativa cannabis', tag: '10 Left' },
  { name: 'Strawberry Cough', hint: 'sativa cannabis' },
  { name: 'Gorilla Glue #4', hint: 'hybrid cannabis', tag: 'Popular' },
  { name: 'Zkittlez', hint: 'indica cannabis', tag: '10% Off' },
];

interface DealsStealsProps {
  onProductClick: (product: Product) => void;
}

export function DealsSteals({ onProductClick }: DealsStealsProps) {
  const handleClick = (deal: { name: string; hint: string, tag?: string }) => {
    const representativeProduct: Product = {
      id: `deal-${deal.name.toLowerCase().replace(' ', '-')}`,
      name: deal.name,
      category: 'Deals',
      type: 'Hybrid',
      thc: 22,
      price: 35.00,
      description: `An amazing deal on ${deal.name}! This popular item is on sale for a limited time. Grab it before it's gone.`,
      image: `https://placehold.co/600x400.png`,
      hint: deal.hint,
    };
    onProductClick(representativeProduct);
  };

  return (
    <section id="deals" className="py-8 md:py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 text-primary">
          Deals & Steals
        </h2>
        <div className="flex -mx-4 pl-4 pr-6 space-x-4 overflow-x-auto pb-4 no-scrollbar">
            {deals.map((deal, index) => (
              <button key={index} onClick={() => handleClick(deal)} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 group text-center focus:outline-none">
                <div className="relative w-[98px] h-[98px] transition-all duration-300">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={`https://placehold.co/90x90.png`}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      width={90}
                      height={90}
                      className="object-cover"
                    />
                  </div>
                </div>
                {deal.tag && (
                  <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    {deal.tag}
                  </div>
                )}
                <p className="text-xs font-medium text-foreground truncate w-full text-center">{deal.name}</p>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
