
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { NotificationCard } from '@/components/notification-card';
import { Loader2 } from 'lucide-react';
import { NotificationDetailModal } from '@/components/notification-detail-modal';
import { generateMockNotifications, type Notification } from '@/lib/mockNotifications';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const NOTIFICATIONS_PER_PAGE = 15;

export default function NotesPage() {
  const { user, isUserLoading: loading } = useUser();
  const [allUserNotifications, setAllUserNotifications] = useState<Notification[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (user) {
      const userNotifications = generateMockNotifications(user.uid);
      setAllUserNotifications(userNotifications);
      setVisibleNotifications(userNotifications.slice(0, NOTIFICATIONS_PER_PAGE));
      setHasMore(userNotifications.length > NOTIFICATIONS_PER_PAGE);
      setPage(1);
    } else {
        setAllUserNotifications([]);
        setVisibleNotifications([]);
    }
  }, [user]);

  const loadMoreNotifications = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newNotifications = allUserNotifications.slice(0, nextPage * NOTIFICATIONS_PER_PAGE);
      setVisibleNotifications(newNotifications);
      setPage(nextPage);
      if (newNotifications.length >= allUserNotifications.length) {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setVisibleNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
     setAllUserNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };
  
  if (loading) {
    return (
       <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
           <Skeleton className="h-10 w-48 mb-6" />
           <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
           </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    )
  }

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl text-center">
                 <h1 className="text-3xl font-bold font-cursive text-destructive mb-6">Notifications</h1>
                 <p className="text-muted-foreground">Please <Link href="/login" className="text-primary underline">log in</Link> to see your notifications.</p>
            </main>
            <Footer />
            <BottomNavBar />
        </div>
    )
  }


  return (
    <>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="text-3xl font-bold font-cursive text-destructive mb-6">Notifications</h1>
          
           {hasMore && (
            <div className="mb-6 text-center">
              <Button onClick={loadMoreNotifications} disabled={isLoading} variant="outline" size="sm">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Loading...' : 'Load Older Notifications'}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {visibleNotifications.length > 0 ? (
                visibleNotifications.map((note) => (
                  <NotificationCard 
                    key={note.id} 
                    notification={note}
                    onClick={() => handleNotificationClick(note)} 
                  />
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No notifications yet.</p>
                </div>
            )}
          </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
      <NotificationDetailModal 
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={handleCloseModal}
      />
    </>
  );
}
