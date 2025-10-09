
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { HeroSlider } from '../hero-slider';
import { ProductCard } from '../product-card';
import { allProducts } from '@/lib/products';
import { ProductDetailModal } from '../product-detail-modal';
import { useState } from 'react';
import type { Product } from '@/types/product';

interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryProductsSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };


  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sheet');
    router.push(pathname + '?' + params.toString());
  };

  return (
      <>
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col bg-transparent backdrop-blur-xl">
        <SheetHeader className="p-4 flex flex-col gap-4 absolute top-0 left-0 right-0 z-10 bg-transparent">
          <HeroSlider />
          <div className="flex justify-between items-center w-full">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                  <SheetTitle className="text-primary">Products</SheetTitle>
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
            <div className="space-y-12 p-4">
                {Object.entries(allProducts).map(([categoryName, products]) => (
                <section key={categoryName}>
                    <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
                    {categoryName}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                        <ProductCard
                        key={product.id}
                        product={product}
                        onProductClick={handleProductClick}
                        />
                    ))}
                    </div>
                </section>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
    <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        product={selectedProduct ?? undefined}
      />
    </>
  );
}
