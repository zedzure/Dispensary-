
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useUser, useAuth, useFirestore, initiateEmailSignUp, initiateEmailSignIn } from '@/firebase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Github } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { User as NewUser } from '@/types/user';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

const createUserProfile = (newUser: FirebaseUser, name: string, db: ReturnType<typeof useFirestore>) => {
  if (db) {
    const newUserDocRef = doc(db, 'users', newUser.uid);
    const newProfile: NewUser = {
      username: newUser.email?.split('@')[0] || newUser.uid,
      displayName: name || newUser.displayName || 'Anonymous',
      photoURL: newUser.photoURL || `https://avatar.vercel.sh/${newUser.uid}`,
      bio: 'Welcome to my profile!',
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date(),
      uid: newUser.uid
    };
    // Non-blocking write
    setDoc(newUserDocRef, newProfile, { merge: true });
  }
}

function AuthForm({
  isSignUp,
  onSubmit,
  children,
}: {
  isSignUp: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="login-card">
      <form className="login-form" onSubmit={onSubmit}>
        <h1 className="form-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        {children}
      </form>
    </div>
  );
}

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/profile');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!signInEmail || !signInPassword) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    initiateEmailSignIn(auth, signInEmail, signInPassword);
  }

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!signUpName || !signUpEmail || !signUpPassword) {
      toast({ title: "Missing Fields", description: "Please fill out all sign up fields.", variant: "destructive" });
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      if (newUser && newUser.email === signUpEmail) {
        unsubscribe();
        createUserProfile(newUser, signUpName, db);
      }
    });
    initiateEmailSignUp(auth, signUpEmail, signUpPassword);
  }

  const handleProviderSignIn = async (providerName: 'google' | 'github') => {
    if (!auth) return;
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        toast({ title: `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} Sign In Failed`, description: e.message, variant: "destructive" });
      }
    }
  }

  if (isUserLoading || user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Leaf className="h-12 w-12 animate-spin text-blue-500" />
            <span>Authenticating...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <Header />
      <main className="login-page-main">
        <div className="flip-card">
          <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="flip-card-front">
              <AuthForm isSignUp={false} onSubmit={handleSignIn}>
                <div className="form-field">
                  <label htmlFor="login-email">Email</label>
                  <input id="login-email" type="email" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="form-field">
                  <label htmlFor="login-password">Password</label>
                  <input id="login-password" type="password" value={signInPassword} onChange={e => setSignInPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="form-button">Sign In</Button>
                <div className="form-divider"></div>
                <Button type="button" onClick={() => handleProviderSignIn('google')} className="form-button-google"><GoogleIcon/> Sign in with Google</Button>
                <Button type="button" onClick={() => handleProviderSignIn('github')} className="form-button-google"><Github className="mr-2 h-4 w-4"/> Sign in with GitHub</Button>
                <p className="form-switch-text">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsFlipped(true)} className="form-switch-button">Sign Up</button>
                </p>
              </AuthForm>
            </div>
            <div className="flip-card-back">
              <AuthForm isSignUp={true} onSubmit={handleSignUp}>
                <div className="form-field">
                  <label htmlFor="signup-name">Name</label>
                  <input id="signup-name" type="text" value={signUpName} onChange={e => setSignUpName(e.target.value)} placeholder="Your Name" />
                </div>
                <div className="form-field">
                  <label htmlFor="signup-email">Email</label>
                  <input id="signup-email" type="email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="form-field">
                  <label htmlFor="signup-password">Password</label>
                  <input id="signup-password" type="password" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="form-button">Create Account</Button>
                <div className="form-divider"></div>
                <Button type="button" onClick={() => handleProviderSignIn('google')} className="form-button-google"><GoogleIcon/> Sign up with Google</Button>
                <Button type="button" onClick={() => handleProviderSignIn('github')} className="form-button-google"><Github className="mr-2 h-4 w-4"/> Sign up with GitHub</Button>
                <p className="form-switch-text">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsFlipped(false)} className="form-switch-button">Sign In</button>
                </p>
              </AuthForm>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
