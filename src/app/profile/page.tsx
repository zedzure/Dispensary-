
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Leaf } from 'lucide-react';

export default function ProfileRedirectPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace(`/profile/${user.uid}`);
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-4">
                <Leaf className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading Profile...</p>
            </div>
        </main>
        <Footer />
    </div>
  );
}
