
'use client';

import Link from 'next/link';
import { Home, User, ClipboardList, Info, Zap, Store } from 'lucide-react';
import { useUser } from '@/firebase';

export function BottomNavBar() {
  const { user } = useUser();

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
    <nav className="fixed bottom-0 left-0 z-50 w-full h-24 bg-background/80 backdrop-blur-xl md:hidden border-t">
      <div className="grid h-full grid-cols-5 max-w-lg mx-auto">
        {allNavItems.map((item) => (
          <Link
              key={item.label}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <item.icon className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                {item.label}
              </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
