
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
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
 * Fetches a user's profile from Firestore or creates it if it doesn't exist.
 * This is the single source of truth for user profile data.
 * @param firebaseUser The authenticated user object from Firebase Auth.
 * @returns The user profile from Firestore.
 */
const createOrUpdateUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User exists, update last login and return profile
        await updateDoc(userRef, { 'activity.lastLogin': serverTimestamp() });
        const profileData = userSnap.data();

        const createdAt = profileData.createdAt instanceof Timestamp ? profileData.createdAt.toDate().toISOString() : new Date().toISOString();
        // For existing users, lastLogin will be updated, but we can return the previously fetched data for immediate UI update.
        const lastLogin = profileData.activity?.lastLogin instanceof Timestamp ? profileData.activity.lastLogin.toDate().toISOString() : new Date().toISOString();
        const joined = profileData.activity?.joined instanceof Timestamp ? profileData.activity.joined.toDate().toISOString() : new Date().toISOString();

        return {
            ...profileData,
            uid: firebaseUser.uid,
            name: profileData.name || firebaseUser.displayName || "User",
            avatarUrl: profileData.avatarUrl || firebaseUser.photoURL,
            createdAt,
            activity: { lastLogin, joined }
        } as AppUser;

    } else {
        // New user, create the profile
        const now = new Date().toISOString();
        const newProfileData: Omit<AppUser, 'createdAt' | 'activity'> & { createdAt: any, activity: any } = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "New User",
            email: firebaseUser.email!,
            avatarUrl: firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            role: 'user',
            points: 0,
            followersCount: 0,
            followingCount: 0,
            createdAt: serverTimestamp(),
            activity: { lastLogin: serverTimestamp(), joined: serverTimestamp() },
            storageLimit: 1024 * 1024 * 1024,
            usedStorage: 0,
        };
        await setDoc(userRef, newProfileData);
        
        // Return a client-side constructed user object immediately
        return {
            ...newProfileData,
            createdAt: now,
            activity: { lastLogin: now, joined: now }
        } as AppUser;
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
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle profile creation/update and state setting
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    setIsLoading(true);
    try {
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "GitHub Sign In Failed",
            description: error.message || "Could not sign in with GitHub. Please try again.",
        });
        setIsLoading(false);
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
      // onAuthStateChanged will handle creating the Firestore profile.
      // We don't need to call createOrUpdateUserProfile here because onAuthStateChanged will fire.
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
