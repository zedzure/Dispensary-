
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

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
        <main className="flex-grow flex items-center justify-center">
             <div className="wrapper">
                <div className="profile-card js-profile-card">
                     <div className="profile-card__img">
                         <Skeleton className="h-full w-full rounded-full" />
                     </div>
                     <div className="profile-card__cnt js-profile-cnt">
                         <Skeleton className="h-8 w-48 mx-auto mb-4" />
                         <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                         <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
                         <div className="profile-card-inf">
                            <div className="profile-card-inf__item">
                                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                            <div className="profile-card-inf__item">
                                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                             <div className="profile-card-inf__item">
                                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                             <div className="profile-card-inf__item">
                                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                         </div>
                         <div className="profile-card-social">
                            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}
                         </div>
                          <div className="profile-card-ctr">
                            <Skeleton className="h-14 w-48 rounded-full" />
                            <Skeleton className="h-14 w-48 rounded-full" />
                         </div>
                     </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}
