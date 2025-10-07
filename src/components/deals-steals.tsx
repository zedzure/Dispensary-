
import Image from 'next/image';
import type { Product } from '@/types/product';
import { realImageUrls } from '@/lib/products';

const newItems = [
  { name: 'Blue Dream', hint: 'sativa cannabis', tag: 'New', image: realImageUrls[0] },
  { name: 'Sour Diesel', hint: 'sativa cannabis', tag: 'Popular', image: realImageUrls[1] },
  { name: 'OG Kush', hint: 'hybrid cannabis', tag: '5% Off', image: realImageUrls[2] },
  { name: 'GSC Pre-roll', hint: 'indica cannabis', tag: 'Just In', image: realImageUrls[3] },
  { name: 'White Widow', hint: 'hybrid cannabis', tag: '10 Left', image: realImageUrls[4] },
  { name: 'CBD Tincture', hint: 'tincture cannabis', tag: 'Sale', image: realImageUrls[5] },
  { name: 'Jack Herer', hint: 'sativa cannabis', tag: '10% Off', image: realImageUrls[6] },
  { name: 'Gummy Edibles', hint: 'gummy candy', tag: 'Sweet Deal', image: realImageUrls[7] },
  { name: 'Vape Pen', hint: 'hybrid cannabis', tag: '5 Left', image: realImageUrls[8] },
  { name: 'Girl Scout Cookies', hint: 'indica cannabis', tag: 'Popular', image: realImageUrls[9] },
  { name: 'Northern Lights', hint: 'indica cannabis', tag: 'Limited', image: realImageUrls[10] },
  { name: 'Bubba Kush', hint: 'indica cannabis', tag: 'New', image: realImageUrls[11] },
  { name: 'Durban Poison', hint: 'sativa cannabis', tag: 'Classic', image: realImageUrls[12] },
  { name: 'Concentrate', hint: 'cannabis oil', tag: 'Just In', image: realImageUrls[13] },
  { name: 'Joint Pack', hint: 'hybrid cannabis', tag: '5% Off', image: realImageUrls[14] },
];

interface NewItemsSectionProps {
  onProductClick: (product: Product) => void;
}

export function NewItemsSection({ onProductClick }: NewItemsSectionProps) {
  const handleClick = (deal: typeof newItems[0]) => {
    const representativeProduct: Product = {
      id: `deal-${deal.name.toLowerCase().replace(' ', '-')}`,
      name: deal.name,
      category: 'New',
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
    <section id="new" className="py-8 md:py-12 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 text-primary">
          What's New
        </h2>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-start space-x-4 pb-4 pl-4 pr-4 md:pl-6 md:pr-6">
            {newItems.map((deal, index) => (
              <button key={index} onClick={() => handleClick(deal)} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 group text-center focus:outline-none">
                <div className="relative w-[98px] h-[98px] transition-all duration-300">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={deal.image}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      fill
                      style={{ objectFit: 'cover' }}
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
