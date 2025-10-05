
'use client';

import React from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { MarketplaceContent } from '@/components/marketplace-content';
import { Skeleton } from '@/components/ui/skeleton';

function MarketplaceSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <header className="text-center mb-12 flex items-center justify-center p-4">
           <Skeleton className="h-[400px] w-full max-w-[600px] rounded-lg" />
        </header>
        
        <div className="container mx-auto px-4 md:px-6 my-8">
            <Skeleton className="h-12 w-full max-w-xl mx-auto" />
        </div>

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
      </main>
      <Footer />
      <BottomNavBar />
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
