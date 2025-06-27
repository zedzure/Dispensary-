
'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ShoppingCart,
  BarChart3,
  Gift,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <Skeleton className="h-96 w-full rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/budtenders', label: 'Budtenders', icon: UserCog },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];
  
  const settingItems = [
      { href: '/admin/points', label: 'Points Engine', icon: Gift },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-sidebar-foreground">{user.name}</span>
                  <span className="text-muted-foreground">Admin</span>
                </div>
              </div>
              <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
            <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}>
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <Accordion type="single" collapsible className="w-full px-2">
                  <AccordionItem value="reports" className="border-b-0">
                    <AccordionTrigger className="w-full flex items-center gap-2 rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg:last-child]:rotate-180 hover:no-underline justify-start">
                      <BarChart3 className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">Reports</span>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pl-5">
                      <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild size="sm" isActive={pathname === '/admin/reports/sales'}>
                                <Link href="/admin/reports/sales">Sales Reports</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild size="sm" isActive={pathname === '/admin/reports/loyalty'}>
                                <Link href="/admin/reports/loyalty">Loyalty Reports</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            {settingItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <Button variant="outline" size="sm" onClick={logout} className="mt-4">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="flex-grow p-4 md:p-8 bg-muted/40">
          {children}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
