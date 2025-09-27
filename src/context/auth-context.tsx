

'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User as AppUser } from '@/types/user';
import { 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


/**
 * Creates or updates a user profile in Firestore.
 * @param firebaseUser The authenticated user object from Firebase Auth.
 * @returns The user profile from Firestore or a newly constructed one.
 */
const createOrUpdateUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    const now = new Date();

    if (userSnap.exists()) {
        // User exists, update last login and return existing data
        const existingData = userSnap.data();
        await updateDoc(userRef, { 'activity.lastLogin': serverTimestamp() });
        
        const createdAt = existingData.createdAt instanceof Timestamp ? existingData.createdAt.toDate().toISOString() : now.toISOString();
        const joined = existingData.activity?.joined instanceof Timestamp ? existingData.activity.joined.toDate().toISOString() : now.toISOString();


        return {
            uid: firebaseUser.uid,
            name: existingData.name || firebaseUser.displayName || 'User',
            email: existingData.email || firebaseUser.email!,
            avatarUrl: existingData.avatarUrl || firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            role: existingData.role || 'user',
            points: existingData.points || 0,
            followersCount: existingData.followersCount || 0,
            followingCount: existingData.followingCount || 0,
            createdAt: createdAt,
            activity: {
                lastLogin: now.toISOString(),
                joined: joined,
            },
            storageLimit: existingData.storageLimit || 1024 * 1024 * 1024,
            usedStorage: existingData.usedStorage || 0,
        };

    } else {
        // New user, create the profile
        const newProfileData = {
            name: firebaseUser.displayName || "New User",
            email: firebaseUser.email!,
            avatarUrl: firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            role: 'user' as const,
            points: 0,
            followersCount: 0,
            followingCount: 0,
            createdAt: serverTimestamp(),
            activity: { lastLogin: serverTimestamp(), joined: serverTimestamp() },
            storageLimit: 1024 * 1024 * 1024, // 1GB
            usedStorage: 0,
        };
        await setDoc(userRef, newProfileData);
        
        // Return a client-safe user object immediately
        return {
            uid: firebaseUser.uid,
            email: newProfileData.email,
            name: newProfileData.name,
            avatarUrl: newProfileData.avatarUrl,
            role: newProfileData.role,
            points: newProfileData.points,
            followersCount: newProfileData.followersCount,
            followingCount: newProfileData.followingCount,
            createdAt: now.toISOString(),
            activity: { lastLogin: now.toISOString(), joined: now.toISOString() },
            storageLimit: newProfileData.storageLimit,
            usedStorage: newProfileData.usedStorage,
        };
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
            const profileData = await createOrUpdateUserProfile(firebaseUser);
            setUser(profileData);
        } catch (err: any) {
            console.error("Failed to create or fetch user profile:", err);
            toast({ title: "Profile Error", description: err.message || "Could not load your profile data.", variant: "destructive" });
            setUser(null);
            await signOut(auth); // Log out if profile fails
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Open popup first to avoid browser blocking
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest, no need to set loading here
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
      setIsLoading(false); // Ensure loading is false on error
    }
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
        // Open popup first
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "GitHub Sign In Failed",
            description: error.message || "Could not sign in with GitHub. Please try again.",
        });
        setIsLoading(false); // Ensure loading is false on error
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Invalid email or password. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      // Update the Firebase Auth profile. This is separate from Firestore.
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: `https://avatar.vercel.sh/${cred.user.uid}`
      });
      // onAuthStateChanged will fire and handle creating the Firestore profile.
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "Could not create an account. The email may already be in use.",
      });
       setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
    toast({ title: "Logged Out", description: "You have been successfully signed out." });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, signInWithGoogle, signInWithGitHub, signUpWithEmail, signInWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
