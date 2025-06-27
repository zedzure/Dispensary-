
'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
    Home, ShoppingBag, Users, BarChart3, LogOut, Menu, Terminal, Package, Ticket, 
    Settings, Store, CreditCard, UserCog, Leaf, Cog, UsersRound, FileText, Gift,
    History, Map, Landmark, Link2, ListChecks, Sparkles, FlaskConical, Briefcase, ShieldCheck, Tag
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/pos', label: 'POS Queue', icon: Terminal },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/promotions', label: 'Promotions', icon: Ticket },
    { href: '/admin/users', label: 'Customers', icon: Users },
    { href: '/admin/staff', label: 'Staff', icon: Briefcase },
    { href: '/admin/budtenders', label: 'Budtenders', icon: UserCog },
    { href: '/admin/processing', label: 'Processing & Mfg.', icon: FlaskConical },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck },
];

const reportItems = [
    { href: '/admin/reports/sales', label: 'Sales Reports', icon: BarChart3 },
    { href: '/admin/reports/inventory', label: 'Inventory Reports', icon: Package },
    { href: '/admin/reports/loyalty', label: 'Loyalty Reports', icon: Gift },
    { href: '/admin/reports/usage', label: 'Usage Reports', icon: FileText },
    { href: '/admin/reports/customer-insights', label: 'Customer Insights', icon: Sparkles },
    { href: '/admin/reports/waste', label: 'Waste Reports', icon: Trash2 },
    { href: '/admin/activity-log', label: 'Activity Log', icon: History },
];

const settingsItems = [
    { href: '/admin/settings', label: 'General', icon: Settings },
    { href: '/admin/settings/locations', label: 'Locations', icon: Map },
    { href: '/admin/settings/payment', label: 'Payment Gateways', icon: CreditCard },
    { href: '/admin/settings/taxes', label: 'Tax Rules', icon: Landmark },
    { href: '/admin/points', label: 'Loyalty Engine', icon: Gift },
    { href: '/admin/settings/compliance', label: 'Compliance', icon: Link2 },
];


export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);
  
  const getHeaderTitle = () => {
    const combinedNav = [...navItems, ...reportItems, ...settingsItems];
    const currentNavItem = combinedNav.find(item => pathname === item.href);
    if(currentNavItem) return currentNavItem.label;

    if (pathname === '/admin') return 'Admin Dashboard';
    if (pathname.startsWith('/admin/print/receipt')) return 'Print Receipt';
    if (pathname.startsWith('/admin/products/print')) return 'Print Inventory List';
    
    // Fallback for dynamic routes or unmatched paths
    const pathParts = pathname.split('/').filter(p => p);
    if (pathParts.length > 1) {
        return pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    
    return `Welcome, ${user?.name || 'Admin'}!`;
  }

  if (isLoading || !user || user.role !== 'admin') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }
  
  const createDropdownMenu = (label: string, icon: React.ElementType, items: typeof navItems, isMobile?: boolean) => {
    const Icon = icon;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary">
                    <Icon className="mr-3 h-5 w-5" /> {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {items.map(item => (
                    <DropdownMenuItem key={item.href} onClick={() => { router.push(item.href); if (isMobile) setIsMobileMenuOpen(false); }}>
                       <item.icon className="mr-2 h-4 w-4" /> {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
  };

  const navLinks = (isMobile?: boolean) => (
    <>
      {navItems.map(item => (
        <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
            asChild
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
            <Link href={item.href}><item.icon className="mr-3 h-5 w-5" /> {item.label}</Link>
        </Button>
      ))}
      {createDropdownMenu("Reports", BarChart3, reportItems, isMobile)}
      {createDropdownMenu("Settings", Settings, settingsItems, isMobile)}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-muted/10">
      <aside className="hidden sm:flex flex-col w-64 bg-background border-r shadow-md flex-shrink-0">
        <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold font-cursive text-primary">{user.name}</h1>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks(false)}
        </nav>
        <div className="p-4 mt-auto border-t">
           <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Menu className="h-5 w-5"/>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:hidden w-64 p-0 pt-10 flex flex-col">
                <div className="p-4 border-b flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-lg font-bold font-cursive text-primary">{user.name}</h1>
                        <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navLinks(true)}
                </nav>
                 <div className="p-4 mt-auto border-t">
                   <Button variant="outline" className="w-full justify-start" onClick={() => { logout(); setIsMobileMenuOpen(false);}}>
                    <LogOut className="mr-3 h-5 w-5" /> Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold font-cursive text-foreground truncate">
              {getHeaderTitle()}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
