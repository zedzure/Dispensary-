'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    if (userData.role === 'budtender') {
      router.push('/budtender');
    } else if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/profile');
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in. Check if we have a local profile.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          // If the stored user matches the firebase user, we are good.
          if (parsedUser.email === firebaseUser.email) {
            setUser(parsedUser);
          } else {
             // Mismatch, clear local storage and create a new profile from Firebase.
            localStorage.removeItem('user');
            const newUserProfile = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email!,
              avatarUrl: firebaseUser.photoURL || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
              role: 'customer' as const,
              memberSince: new Date().toISOString(),
              points: 0,
              nextReward: 1000,
              bio: 'Just joined!',
            };
            login(newUserProfile);
          }
        } else {
            // No user in local storage, so this is a fresh sign-in. Create a profile.
            const newUserProfile = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email!,
              avatarUrl: firebaseUser.photoURL || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
              role: 'customer' as const,
              memberSince: new Date().toISOString(),
              points: 0,
              nextReward: 1000,
              bio: 'Just joined!',
            };
            login(newUserProfile);
        }
      } else {
        // User is signed out.
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [login]);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // The onAuthStateChanged listener will handle the result of this action.
      await signInWithPopup(auth, provider);
    } catch (error) {
      // You can add more robust error handling here, e.g. using toasts
      console.error("Error during Google sign-in:", error);
    }
  };


  const value = { user, login, logout, signInWithGoogle, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
