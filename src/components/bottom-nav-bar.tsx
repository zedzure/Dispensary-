
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
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-white/30 bg-white/20 backdrop-blur-xl shadow-lg md:hidden">
      <div className="grid h-24 grid-cols-5 max-w-lg mx-auto items-center">
        {allNavItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-center">
            <Link
              href={item.href}
              className="relative w-16 h-16 flex flex-col items-center justify-center rounded-full backdrop-blur-2xl bg-white/20 border border-white/30 text-primary shadow-[0_8px_32px_0_rgba(31,38,135,0.2),inset_0_2px_12px_rgba(255,255,255,0.6)]"
            >
              <item.icon className="w-6 h-6" />
            </Link>
             <span className="text-xs mt-1 text-foreground">
                {item.label}
              </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
