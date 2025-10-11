
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, setDocumentNonBlocking, useDoc } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { UserProfileCard } from '@/components/user-profile-card';
import type { UserProfile as OldUserProfile } from '@/types/pos';
import type { User as NewUser } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileSheets } from '@/components/user-profile-sheets';
import type { UploadItem } from '@/types/pos';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export type ActiveSheet = 'receipts' | 'uploads' | 'notes' | 'search' | null;


function ProfilePageSkeleton() {
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


export default function ProfilePage() {
  const { user, isUserLoading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const router = useRouter();

  const userDocRef = (user && db) ? doc(db, 'users', user.uid) : null;
  const { data: profile, isLoading: profileLoading } = useDoc<NewUser>(userDocRef);

  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (user && !profileLoading && !profile) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const newProfile: NewUser = {
            username: user.email?.split('@')[0] || user.uid,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || `https://avatar.vercel.sh/${user.uid}`,
            bio: 'Welcome to my profile!',
            followersCount: 0,
            followingCount: 0,
            createdAt: serverTimestamp(),
            uid: user.uid
          };
          setDocumentNonBlocking(userDocRef, newProfile, { merge: true });
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      }
    };

    if (!authLoading) {
        if (user) {
            createProfileIfNeeded();
        } else {
            router.replace('/login');
        }
    }
  }, [user, profile, profileLoading, authLoading, db, router]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleProfileUpdate = (updatedProfile: Partial<OldUserProfile>) => {
    // This function is now more complex because the profile data is from Firestore.
    // We'll handle updates directly via Firestore now.
  };
  
  if (authLoading || profileLoading) {
    return <ProfilePageSkeleton />;
  }
  
  if (!user) {
    return <ProfilePageSkeleton />; // Or a redirect component
  }

  // This is a temporary adapter to make the old UserProfileCard work with the new User data structure.
  // In a real refactor, you'd update UserProfileCard to accept the new User type.
  const adaptedProfile: OldUserProfile | null = profile ? {
      id: user.uid,
      firstName: profile.displayName?.split(' ')[0] || '',
      lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      memberSince: profile.createdAt?.toDate ? profile.createdAt.toDate().toISOString() : new Date().toISOString(),
      avatarUrl: profile.photoURL || '',
      bio: profile.bio,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      // Defaulting other fields as they don't exist on the new User model
      points: 0,
      followers: [],
      following: [],
      reviewsToday: 0,
      receiptsThisWeek: 0,
  } : null;

  if (!adaptedProfile) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">Could not load profile. Please try again.</p>
                    <Button onClick={handleLogout} variant="destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <div className="hole">
        <div className="aura"></div>
        <div className="overlay"></div>
        <canvas id="canvas"></canvas>
      </div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full">
            <UserProfileCard profile={adaptedProfile} setActiveSheet={setActiveSheet} onUpdate={handleProfileUpdate} />
             <div className="text-center mt-4">
                 <Button onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
             </div>
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
     <UserProfileSheets 
        user={user}
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        uploads={uploads}
      />
    </>
  );
}
