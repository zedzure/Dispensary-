
'use client';

import Link from 'next/link';
import { Home, User, ClipboardList, Info, Zap, Store } from 'lucide-react';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
        {allNavItems.map((item, i) => (
          <div key={item.label} className="flex items-center justify-center">
            <motion.div
              animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.02, 1],
              }}
              transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
              }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-16 w-16 rounded-full text-center group focus:outline-none",
                  "backdrop-blur-3xl bg-white/20 border border-white/30 rounded-3xl shadow-[inset_0_0_10px_rgba(255,255,255,0.4),0_8px_32px_rgba(31,38,135,0.25)] bg-gradient-to-br from-white/25 to-sky-200/10"
                )}
              >
                <item.icon className="w-6 h-6 text-blue-600 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                <span className="text-xs text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-500 sr-only">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </nav>
  );
}
