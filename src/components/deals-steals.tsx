
import Image from 'next/image';
import type { Product } from '@/types/product';

const deals = [
  { name: 'Blue Dream', hint: 'sativa cannabis', tag: 'New', image: 'https://images.unsplash.com/photo-1616694639036-935c75a45270?q=80&w=600&auto=format&fit=crop' },
  { name: 'Sour Diesel', hint: 'sativa cannabis', tag: 'Popular', image: 'https://images.unsplash.com/photo-1608929033586-9a2373e0f735?q=80&w=600&auto=format&fit=crop' },
  { name: 'OG Kush', hint: 'hybrid cannabis', tag: '5% Off', image: 'https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=600&auto=format&fit=crop' },
  { name: 'GSC Pre-roll', hint: 'indica cannabis', tag: 'Just In', image: 'https://images.unsplash.com/photo-1599425883628-76503c3fc6a3?q=80&w=600&auto=format&fit=crop' },
  { name: 'White Widow', hint: 'hybrid cannabis', tag: '10 Left', image: 'https://images.unsplash.com/photo-1631557813531-1f3162a8c326?q=80&w=600&auto=format&fit=crop' },
  { name: 'CBD Tincture', hint: 'tincture cannabis', image: 'https://images.unsplash.com/photo-1631094034889-8669b3252f41?q=80&w=600&auto=format&fit=crop' },
  { name: 'Jack Herer', hint: 'sativa cannabis', tag: '10% Off', image: 'https://images.unsplash.com/photo-1627522502813-f3687a731d68?q=80&w=600&auto=format&fit=crop' },
  { name: 'Gummy Edibles', hint: 'gummy candy', image: 'https://images.unsplash.com/photo-1620573934390-33759a2c358f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Vape Pen', hint: 'hybrid cannabis', tag: '5 Left', image: 'https://images.unsplash.com/photo-1611294612375-a8c67921010b?q=80&w=600&auto=format&fit=crop' },
  { name: 'Girl Scout Cookies', hint: 'indica cannabis', tag: 'Popular', image: 'https://images.unsplash.com/photo-1621293292444-a6a1f8ad81c4?q=80&w=600&auto=format&fit=crop' },
  { name: 'Northern Lights', hint: 'indica cannabis', image: 'https://images.unsplash.com/photo-1590420799015-bd424953457f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Bubba Kush', hint: 'indica cannabis', tag: 'New', image: 'https://images.unsplash.com/photo-1618233336943-e99427b3e1b7?q=80&w=600&auto=format&fit=crop' },
  { name: 'Durban Poison', hint: 'sativa cannabis', image: 'https://images.unsplash.com/photo-1628029519113-4c59385555d4?q=80&w=600&auto=format&fit=crop' },
  { name: 'Concentrate', hint: 'cannabis oil', tag: 'Just In', image: 'https://images.unsplash.com/photo-1642289452813-912b3236a53b?q=80&w=600&auto=format&fit=crop' },
  { name: 'Joint Pack', hint: 'hybrid cannabis', tag: '5% Off', image: 'https://images.unsplash.com/photo-1609252811124-5e4548483542?q=80&w=600&auto=format&fit=crop' },
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
        <div className="flex items-start space-x-4 pb-4 px-4 md:px-6">
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
