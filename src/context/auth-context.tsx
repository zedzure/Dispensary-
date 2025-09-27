

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
import { doc, getDoc, setDoc, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';
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
 * Creates or retrieves a user profile in Firestore. This function is optimized to
 * minimize round trips and improve performance.
 * @param firebaseUser The authenticated user object from Firebase Auth.
 * @returns A promise that resolves to the application's user profile object.
 */
const createOrUpdateUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    const now = new Date();

    if (userSnap.exists()) {
        // --- EXISTING USER ---
        // Update last login time in the background. No need to await this.
        updateDoc(userRef, { 'activity.lastLogin': serverTimestamp() });
        
        const existingData = userSnap.data();
        // Construct the user object immediately from the data we just fetched.
        return {
            uid: firebaseUser.uid,
            email: existingData.email || firebaseUser.email!,
            name: existingData.name || firebaseUser.displayName || 'User',
            avatarUrl: existingData.avatarUrl || firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            role: existingData.role || 'user',
            points: existingData.points ?? 0,
            followersCount: existingData.followersCount ?? 0,
            followingCount: existingData.followingCount ?? 0,
            createdAt: (existingData.createdAt as Timestamp)?.toDate().toISOString() || now.toISOString(),
            activity: {
                lastLogin: now.toISOString(), // Use client time for immediate UI update
                joined: (existingData.activity?.joined as Timestamp)?.toDate().toISOString() || now.toISOString(),
            },
            storageLimit: existingData.storageLimit ?? 1024 * 1024 * 1024,
            usedStorage: existingData.usedStorage ?? 0,
        };

    } else {
        // --- NEW USER ---
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

        // Create the document.
        await setDoc(userRef, newProfileData);
        
        // Return a client-safe user object immediately without another read.
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
            // Don't log out here, as it might cause loops if the error is intermittent.
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAuthAction = async (authPromise: Promise<any>) => {
    try {
      await authPromise;
      // onAuthStateChanged will handle success, no need to set loading here.
    } catch (error: any) {
      // Don't show generic error for user-cancelled popups
      if (error.code !== 'auth/popup-closed-by-user') {
          toast({
              variant: "destructive",
              title: "Sign In Failed",
              description: error.message || "An unexpected error occurred. Please try again.",
          });
      }
      setIsLoading(false); // Ensure loading is false on error
    }
  };

  const signInWithGoogle = async () => {
    handleAuthAction(signInWithPopup(auth, new GoogleAuthProvider()));
  };

  const signInWithGitHub = async () => {
    handleAuthAction(signInWithPopup(auth, new GithubAuthProvider()));
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
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
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: `https://avatar.vercel.sh/${cred.user.uid}`
      });
      // onAuthStateChanged will fire and create the Firestore profile.
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
    setUser(null);
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
