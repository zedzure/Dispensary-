
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          if (parsedUser.email === firebaseUser.email) {
            setUser(parsedUser);
          } else {
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
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    if (userData.role === 'budtender') {
      router.push('/budtender');
    } else if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/profile');
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const newUser: User = {
        name: firebaseUser.displayName || 'New User',
        email: firebaseUser.email!,
        avatarUrl: firebaseUser.photoURL || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
        role: 'customer',
        memberSince: new Date().toISOString(),
        points: 0,
        nextReward: 1000,
        bio: 'Just joined via Google!',
      };
      login(newUser);

    } catch (error) {
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
