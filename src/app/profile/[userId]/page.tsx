

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, useAuth, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
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
                 <div className="glass-profile-card">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="flex flex-col gap-2 items-center">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/10 rounded-2xl">
                        {[...Array(4)].map((_,i) => (
                             <div key={i} className="text-center">
                                <Skeleton className="h-7 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-2xl" />)}
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}


export default function ProfilePage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const userDocRef = useMemoFirebase(
    () => (userId && db ? doc(db, 'users', userId) : null),
    [userId, db]
  );
  const { data: profile, isLoading: profileLoading } = useDoc<NewUser>(userDocRef);

  useEffect(() => {
    const createProfileIfNeeded = async () => {
      // Create profile only if viewing own profile and it doesn't exist
      if (authUser && authUser.uid === userId && !profileLoading && !profile) {
        if (!db) return;
        try {
          const newUserDocRef = doc(db, 'users', authUser.uid);
          const newProfile: NewUser = {
            username: authUser.email?.split('@')[0] || authUser.uid,
            displayName: authUser.displayName || 'Anonymous User',
            photoURL: authUser.photoURL || `https://avatar.vercel.sh/${authUser.uid}`,
            bio: 'Welcome to my profile!',
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date(),
            uid: authUser.uid
          };
          setDocumentNonBlocking(newUserDocRef, newProfile, { merge: true });
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      }
    };

    if (!authLoading && authUser) {
        createProfileIfNeeded();
    }
  }, [authUser, userId, profile, profileLoading, authLoading, db]);


  const handleLogout = async () => {
    if(!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const handleProfileUpdate = (updatedProfile: Partial<OldUserProfile>) => {
    // This function is now more complex because the profile data is from Firestore.
    // We'll handle updates directly via Firestore now.
  };
  
  if (authLoading || profileLoading || !userId) {
    return <ProfilePageSkeleton />;
  }
  
  if (!profile) {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center text-center px-4">
                <div>
                    <p className="text-destructive mb-4 text-xl">User profile not found.</p>
                    <Button onClick={() => router.push('/')}>Go Home</Button>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  // This is a temporary adapter to make the old UserProfileCard work with the new User data structure.
  // In a real refactor, you'd update UserProfileCard to accept the new User type.
  const adaptedProfile: OldUserProfile | null = profile ? {
      id: profile.uid,
      firstName: profile.displayName?.split(' ')[0] || '',
      lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
      email: '', // Not available on the new user model publicly
      memberSince: profile.createdAt ? (profile.createdAt as any).toDate ? (profile.createdAt as any).toDate().toISOString() : new Date(profile.createdAt as any).toISOString() : new Date().toISOString(),
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
    return <ProfilePageSkeleton />; // Should be covered by the !profile check, but good for safety
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
       <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-cover bg-center bg-no-repeat" 
         style={{backgroundImage: "url('https://storage.googleapis.com/project-13773344-54196.appspot.com/assets/leaf-background.png')"}}
       >
        <div className="absolute inset-0 bg-background/40" />
      </div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full">
            <UserProfileCard profile={adaptedProfile} setActiveSheet={setActiveSheet} onUpdate={handleProfileUpdate} />
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
     {authUser && (
         <UserProfileSheets 
            user={authUser}
            activeSheet={activeSheet}
            setActiveSheet={setActiveSheet}
            uploads={uploads}
          />
     )}
    </>
  );
}
