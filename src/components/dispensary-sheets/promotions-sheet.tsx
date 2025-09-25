
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Ticket } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const mockPromoProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `promo-${i}`,
  name: `Promo Product ${i + 1}`,
  brand: i % 2 === 0 ? 'Daily Deals' : 'CannaSaver',
  strain: i % 3 === 0 ? 'Indica' : i % 3 === 1 ? 'Sativa' : 'Hybrid',
  thc: (18 + (i * 1.1) % 10).toFixed(1),
  price: (25 + (i * 2) % 15).toFixed(2),
  originalPrice: (35 + (i * 2) % 15).toFixed(2),
  image: `https://picsum.photos/id/${300 + i}/200/200`
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
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-4">
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
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint="cannabis flower" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.strain} | THC: {product.thc}%</p>
                  </div>
                  <Button size="icon" variant="outline" className="h-10 w-10">
                    <PlusCircle className="h-5 w-5" />
                    <span className="sr-only">Add to cart</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
