
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This function should only be called on the client side.
function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { firebaseApp: app, auth, firestore };
}


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Memoize the Firebase services to ensure they are initialized only once per client session.
  const firebaseServices = useMemo(() => {
    // This check ensures that Firebase is only initialized on the client side.
    if (typeof window === 'undefined') {
        return { firebaseApp: null, auth: null, firestore: null };
    }
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
