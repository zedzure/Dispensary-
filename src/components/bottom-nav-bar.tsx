
'use client';

import Link from 'next/link';
import { User, LayoutDashboard, Gift, Sparkles, Mail, MapPin } from 'lucide-react';

export function BottomNavBar() {
  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Home' },
    { href: '#deals', icon: Gift, label: 'Deals' },
    { href: '#recommender', icon: Sparkles, label: 'AI' },
    { href: '#why-us', icon: MapPin, label: 'Locations' },
    { href: '/login', icon: User, label: 'Profile' },
    { href: '#', icon: Mail, label: 'Contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-6 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="inline-flex flex-col items-center justify-center px-1 text-center text-muted-foreground hover:text-primary group"
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
