
import Image from 'next/image';
import type { Product } from '@/types/product';

const placeholderImage = 'https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=600';

const deals = [
  { name: 'Blue Dream', hint: 'sativa cannabis', tag: 'New', image: placeholderImage },
  { name: 'Sour Diesel', hint: 'sativa cannabis', tag: 'Popular', image: placeholderImage },
  { name: 'OG Kush', hint: 'hybrid cannabis', tag: '5% Off', image: placeholderImage },
  { name: 'GSC Pre-roll', hint: 'indica cannabis', tag: 'Just In', image: placeholderImage },
  { name: 'White Widow', hint: 'hybrid cannabis', tag: '10 Left', image: placeholderImage },
  { name: 'CBD Tincture', hint: 'tincture cannabis', tag: 'Sale', image: placeholderImage },
  { name: 'Jack Herer', hint: 'sativa cannabis', tag: '10% Off', image: placeholderImage },
  { name: 'Gummy Edibles', hint: 'gummy candy', tag: 'Sweet Deal', image: placeholderImage },
  { name: 'Vape Pen', hint: 'hybrid cannabis', tag: '5 Left', image: placeholderImage },
  { name: 'Girl Scout Cookies', hint: 'indica cannabis', tag: 'Popular', image: placeholderImage },
  { name: 'Northern Lights', hint: 'indica cannabis', tag: 'Limited', image: placeholderImage },
  { name: 'Bubba Kush', hint: 'indica cannabis', tag: 'New', image: placeholderImage },
  { name: 'Durban Poison', hint: 'sativa cannabis', tag: 'Classic', image: placeholderImage },
  { name: 'Concentrate', hint: 'cannabis oil', tag: 'Just In', image: placeholderImage },
  { name: 'Joint Pack', hint: 'hybrid cannabis', tag: '5% Off', image: placeholderImage },
];

interface DealsStealsProps {
  onProductClick: (product: Product) => void;
}

export function DealsSteals({ onProductClick }: DealsStealsProps) {
  const handleClick = (deal: typeof deals[0]) => {
    const representativeProduct: Product = {
      id: `deal-${deal.name.toLowerCase().replace(' ', '-')}`,
      name: deal.name,
      category: 'Deals',
      type: 'Hybrid',
      thc: 22,
      price: 35.00,
      description: `An amazing deal on ${deal.name}! This popular item is on sale for a limited time. Grab it before it's gone.`,
      image: deal.image,
      hint: deal.hint,
    };
    onProductClick(representativeProduct);
  };

  return (
    <section id="deals" className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 text-primary">
          Deals & Steals
        </h2>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-start space-x-4 pb-4 pl-4 pr-4 md:pl-6 md:pr-6">
            {deals.map((deal, index) => (
              <button key={index} onClick={() => handleClick(deal)} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 group text-center focus:outline-none">
                <div className="relative w-[98px] h-[98px] transition-all duration-300">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={deal.image}
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
