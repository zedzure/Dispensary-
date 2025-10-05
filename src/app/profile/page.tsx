
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { UserProfileCard } from '@/components/user-profile-card';
import type { UserProfile } from '@/types/pos';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileSheets } from '@/components/user-profile-sheets';
import type { UploadItem } from '@/types/pos';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
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
            let newProfile: UserProfile;

            // Create a special detailed profile for the specified UID
            if (user.uid === 'p9ZjS1zAbTWrxryVd1HA1ftUcl32') {
                newProfile = {
                    id: user.uid,
                    firstName: 'Kim',
                    lastName: 'Possible',
                    email: user.email || 'kim@gmail.com',
                    memberSince: user.metadata.creationTime || new Date().toISOString(),
                    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
                    dataAiHint: 'person face',
                    points: 123,
                    followers: [],
                    following: [],
                    followersCount: 1598,
                    followingCount: 65,
                    bio: `Front-end Developer from <strong>Mesopotamia</strong>`,
                    reviewsToday: 123,
                    receiptsThisWeek: 85,
                };
            } else {
                // Create and save a new default profile for other users
                newProfile = {
                    id: user.uid,
                    firstName: user.displayName?.split(' ')[0] || 'New',
                    lastName: user.displayName?.split(' ').slice(1).join(' ') || 'User',
                    email: user.email || '',
                    memberSince: user.metadata.creationTime || new Date().toISOString(),
                    avatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}`,
                    points: 123,
                    followers: [],
                    following: [],
                    followersCount: 1598,
                    followingCount: 65,
                    bio: `Front-end Developer from <strong>Mesopotamia</strong>`,
                    reviewsToday: 123,
                    receiptsThisWeek: 85,
                };
            }
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
  }, [user, authLoading, db]);

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
      <a-hole>
        <div className="aura"></div>
        <div className="overlay"></div>
        <canvas id="canvas"></canvas>
      </a-hole>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
            <UserProfileCard profile={profile} setActiveSheet={setActiveSheet} />
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
     <UserProfileSheets 
        user={user}
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        uploads={uploads}
      />
    </>
  );
}
