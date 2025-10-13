
'use client';

import { DependencyList, useMemo, useContext } from 'react';
import { FirebaseContext, FirebaseContextState } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';


// Re-export the providers from here to create a single entry point.
export { FirebaseProvider } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { initializeFirebase } from './client-provider';


// All hooks are now defined or re-exported from this central file.
export interface FirebaseServicesAndUser extends FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.firebaseApp || !context.firestore || !context.auth) {
    // This can happen during SSR or if the provider is not set up correctly.
    // Instead of throwing, we could return a loading/unavailable state.
    // For now, we throw to make it clear that the services are not available.
    throw new Error('Firebase core services not available. This may be due to SSR or a misconfigured provider.');
  }
  
  return {
    ...context,
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
   if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
};


// The memoization hook remains here.
type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);
  return memoized;
}

// Export other necessary modules.
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
