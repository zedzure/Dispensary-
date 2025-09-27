'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading Profile...</span>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
                <p className="text-destructive">Error: {error.message}</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
                <p>Redirecting to login...</p>
            </main>
            <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-background p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.displayName || user.email}</h1>
          <p className="text-muted-foreground mb-6">You have successfully logged in.</p>
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
