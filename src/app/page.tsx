
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Dispensary } from '@/types/pos';
import { DispensaryDetailSheet } from '@/components/dispensary-detail-sheet';
import { dispensariesByState } from '@/lib/dispensaries';
import { ProductDetailModal } from '@/components/product-detail-modal';
import type { Product } from '@/types/product';
import { HeroSlider } from '@/components/hero-slider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { allProductsFlat } from '@/lib/products';
import { StateSearch } from '@/components/state-search';
import { StateStoryReel } from '@/components/state-story-reel';
import { Skeleton } from '@/components/ui/skeleton';

function MarketplaceSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <header className="text-center mb-12 flex items-center justify-center p-4">
           <Skeleton className="h-[400px] w-full max-w-[600px] rounded-lg" />
        </header>
        
        <div className="mb-12">
          <div className="overflow-x-auto no-scrollbar">
              <div className="flex items-start gap-4 px-4 md:px-6 pb-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 w-28 flex-shrink-0">
                        <Skeleton className="h-[98px] w-[98px] rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
              </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 my-8">
            <Skeleton className="h-12 w-full max-w-xl mx-auto" />
        </div>

      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}

function MarketplaceContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const displayedDispensaries = Array.isArray(dispensariesByState)
    ? dispensariesByState.flatMap(s => s.dispensaries || [])
    : [];

  const buildUrl = (params: URLSearchParams) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return buildUrl(params);
    },
    [searchParams, pathname]
  );

  const deleteQueryString = useCallback(
    (name: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      const names = Array.isArray(name) ? name : [name];
      names.forEach(n => params.delete(n));
      return buildUrl(params);
    },
    [searchParams, pathname]
  );

  useEffect(() => {
    const dispensaryId = searchParams.get('dispensary');
    const productId = searchParams.get('product');

    if (dispensaryId && displayedDispensaries.length > 0) {
      const foundDispensary = displayedDispensaries.find(d => d.id === dispensaryId);
      if (foundDispensary) {
        setSelectedDispensary(foundDispensary);
        setIsDetailSheetOpen(true);
      } else {
        router.push(deleteQueryString('dispensary'), { scroll: false });
      }
    } else {
      if (isDetailSheetOpen) {
        setIsDetailSheetOpen(false);
        // Delay clearing to allow for sheet close animation
        setTimeout(() => setSelectedDispensary(null), 300);
      }
    }

    if (productId) {
      const foundProduct = allProductsFlat.find(p => p.id === productId);
      if (foundProduct) {
        setSelectedProduct(foundProduct);
      } else {
        router.push(deleteQueryString('product'), { scroll: false });
      }
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams, deleteQueryString, router, displayedDispensaries, isDetailSheetOpen]);
  
  const handleDetailSheetOpenChange = (open: boolean) => {
    if (!open) {
      router.push(deleteQueryString(['dispensary', 'sheet']), { scroll: false });
    }
    setIsDetailSheetOpen(open);
  };

  const handleProductClick = (product: Product) => {
    router.push(createQueryString('product', product.id), { scroll: false });
  };

  const closeProductModal = () => {
    router.push(deleteQueryString('product'), { scroll: false });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-32 md:pb-0">
        <header className="text-center mb-4 flex items-center justify-center p-4">
          <HeroSlider />
        </header>
        
        <div className="mb-8">
          <StateStoryReel />
        </div>

        <div className="container mx-auto px-4 md:px-6 my-8">
            <StateSearch />
        </div>

      </main>
      <Footer />
      <BottomNavBar />

      <DispensaryDetailSheet
        dispensary={selectedDispensary}
        isOpen={isDetailSheetOpen}
        onOpenChange={handleDetailSheetOpenChange}
      />
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeProductModal()}
        product={selectedProduct ?? undefined}
      />
    </div>
  );
}


export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceSkeleton />}>
      <MarketplaceContent />
    </Suspense>
  );
}
