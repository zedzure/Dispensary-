
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { UserProfileCard } from '@/components/user-profile-card';
import type { UserProfile } from '@/types/pos';
import { Skeleton } from '@/components/ui/skeleton';

function ProfilePageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted/40">
                <div className="w-full max-w-sm mx-auto p-4">
                    <div className="bg-background p-8 rounded-lg shadow-lg text-center">
                         <Skeleton className="h-24 w-24 rounded-full mx-auto -mt-16" />
                         <Skeleton className="h-8 w-48 mx-auto mt-6 mb-4" />
                         <Skeleton className="h-4 w-full mb-2" />
                         <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
                         <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}


export default function ProfilePage() {
  const [user, authLoading] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Create and save a new profile if one doesn't exist
            const newProfile: UserProfile = {
                id: user.uid,
                firstName: user.displayName?.split(' ')[0] || 'New',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || 'User',
                email: user.email || '',
                memberSince: user.metadata.creationTime || new Date().toISOString(),
                avatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}`,
                points: 0,
                followers: [],
                following: [],
                followersCount: 0,
                followingCount: 0,
                bio: 'A new member of the GreenLeaf Guide community!',
            };
            await setDoc(userDocRef, newProfile, { merge: true });
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching or creating user profile:", error);
        } finally {
          setProfileLoading(false);
        }
      } else if (!authLoading) {
        // If not loading and no user, stop loading and trigger redirect
        setProfileLoading(false);
      }
    };

    fetchOrCreateProfile();
  }, [user, authLoading]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  if (authLoading || profileLoading) {
    return <ProfilePageSkeleton />;
  }
  
  if (!user) {
    router.replace('/login');
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
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
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
            <UserProfileCard profile={profile} />
             <div className="text-center mt-4">
                 <Button onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
             </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
