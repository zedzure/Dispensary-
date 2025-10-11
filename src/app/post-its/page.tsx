
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { PostItCard } from '@/components/post-it-card';
import { Loader2, StickyNote } from 'lucide-react';
import type { PostIt } from '@/types/post-it';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostItsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const postItsQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'post-its') : null),
    [firestore, user]
  );
  
  const { data: postIts, isLoading: postItsLoading } = useCollection<PostIt>(postItsQuery);

  if (isUserLoading || (user && postItsLoading)) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold font-cursive text-primary mb-6">My Post-its</h1>
          <p className="text-muted-foreground">
            Please <Link href="/login" className="text-primary underline">log in</Link> to see your notes.
          </p>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-cursive text-primary">My Post-its</h1>
          <Button>
            <StickyNote className="mr-2 h-4 w-4" /> Add Note
          </Button>
        </div>

        {postIts && postIts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {postIts.map((note) => (
              <PostItCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <StickyNote className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg">You haven't created any notes yet.</p>
            <p>Click "Add Note" to get started!</p>
          </div>
        )}
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
