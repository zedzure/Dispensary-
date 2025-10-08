
'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PublicMenu } from '@/components/public-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavBar } from '@/components/bottom-nav-bar';

function MenuPageContent() {
  const params = useParams();
  const locationId = params.locationId as string;
  const locationName = locationId ? locationId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Our';

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground overflow-hidden">
      <Header />
      <main className="flex-grow pt-16">
        <PublicMenu locationId={locationId} locationName={locationName} />
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<MenuPageSkeleton />}>
            <MenuPageContent />
        </Suspense>
    );
}

function MenuPageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8 pt-24">
                <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
                <div className="space-y-16">
                    <div>
                        <Skeleton className="h-10 w-1/4 mb-8" />
                        <div className="flex gap-6 overflow-hidden">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-72 flex-shrink-0" />)}
                        </div>
                    </div>
                     <div>
                        <Skeleton className="h-10 w-1/4 mb-8" />
                        <div className="flex gap-6 overflow-hidden">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-72 flex-shrink-0" />)}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
