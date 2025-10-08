
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductBubble } from '../product-bubble';

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
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col bg-background/80 backdrop-blur-xl">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-4 bg-transparent">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft />
          </Button>
          <div>
            <SheetTitle>Promotions</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-grow">
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
