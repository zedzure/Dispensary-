
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductBubble } from '../product-bubble';
import { HeroSlider } from '../hero-slider';


const mockPromoProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `promo-${i}`,
  name: `Promo Product ${i + 1}`,
  category: i % 2 === 0 ? 'Daily Deals' : 'CannaSaver',
  type: (['Indica', 'Sativa', 'Hybrid'] as const)[i % 3],
  thc: parseFloat((18 + (i * 1.1) % 10).toFixed(1)),
  price: parseFloat((25 + (i * 2) % 15).toFixed(2)),
  description: `A special promotional offer for ${`Promo Product ${i + 1}`}. Limited time only!`,
  image: `https://picsum.photos/id/${300 + i}/200/200`,
  hint: "cannabis flower",
}));


interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryPromotionsSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sheet');
    router.push(pathname + '?' + params.toString());
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col bg-transparent backdrop-blur-xl">
        <SheetHeader className="p-4 flex flex-col gap-4 absolute top-0 left-0 right-0 z-10">
          <HeroSlider />
          <div className="flex justify-between items-center w-full">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                  <SheetTitle className="text-primary">Promotions</SheetTitle>
                  <SheetDescription className="text-primary">{dispensary.name}</SheetDescription>
              </div>
              <div className="flex-1 flex justify-end">
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                      <ArrowLeft className="text-blue-500" />
                  </Button>
              </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-grow pt-[calc(18rem+env(safe-area-inset-top))]">
          <div className="p-4 space-y-4">
            {mockPromoProducts.map((product) => (
                <ProductBubble key={product.id} product={product} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
