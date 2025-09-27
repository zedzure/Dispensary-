'use client';

import Link from 'next/link';
import { Home, User, ClipboardList, Info, Zap, Store } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export function BottomNavBar() {
  const [user] = useAuthState(auth);

  const navItems = [
    { href: '/', icon: Store, label: 'Marketplace' },
    { href: '/#new', icon: Zap, label: 'New' },
    { href: '/about', icon: Info, label: 'About' },
    { href: '/notes', icon: ClipboardList, label: 'Notes' },
  ];
  
  const authItem = user
    ? { href: '/profile', icon: User, label: 'Profile' }
    : { href: '/login', icon: User, label: 'Login' };

  const allNavItems = [...navItems, authItem];


  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-5 max-w-lg mx-auto">
        {allNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="inline-flex flex-col items-center justify-center px-1 text-center text-primary hover:text-primary/80 group"
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
