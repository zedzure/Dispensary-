
'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { DispensaryCard } from '@/components/dispensary-card';
import { DispensaryDetailSheet } from '@/components/dispensary-detail-sheet';
import { dispensariesByState } from '@/lib/dispensaries';
import { states } from '@/lib/states';
import type { Dispensary } from '@/types/pos';
import { Store } from 'lucide-react';
import { ProductDetailModal } from '@/components/product-detail-modal';
import type { Product } from '@/types/product';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeroSlider } from '@/components/hero-slider';

export default function StatePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const stateName = decodeURIComponent(params.stateName as string);
  
  const stateData = states.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  
  if (!stateData) {
    notFound();
  }

  const stateDispensaries = dispensariesByState.find(s => s.stateName.toLowerCase() === stateName.toLowerCase())?.dispensaries || [];

  const handleDispensaryClick = (dispensary: Dispensary) => {
    setSelectedDispensary(dispensary);
    setIsDetailSheetOpen(true);
  };

  const handleDetailSheetOpenChange = (open: boolean) => {
    if (!open) {
      setIsDetailSheetOpen(false);
      setTimeout(() => setSelectedDispensary(null), 300);
    }
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const closeProductModal = () => {
    setSelectedProduct(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-32">
        <header className="text-center mb-12 flex items-center justify-center p-4">
          <HeroSlider />
        </header>
        <section className="py-12 text-center">
          <Store className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-cursive mt-4 text-primary">
            Dispensaries in {stateData.name}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore top-rated dispensaries for delivery and pickup in your area.
          </p>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-8">
           {stateDispensaries.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {stateDispensaries.map((dispensary) => (
                        <DispensaryCard
                        key={dispensary.id}
                        dispensary={dispensary}
                        onDispensaryClick={handleDispensaryClick}
                        />
                    ))}
                </div>
            ) : (
            <p className="col-span-full text-center text-muted-foreground">
                No dispensaries listed for this state yet.
            </p>
            )}
        </section>
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

    