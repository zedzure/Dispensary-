
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Users, ShoppingBag, DollarSign, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user.name}. Full system control.</p>
                </div>
                <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">System Settings</span>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,254</div>
                        <p className="text-xs text-muted-foreground">+120 this month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,678</div>
                        <p className="text-xs text-muted-foreground">+300 this month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$125,789.00</div>
                        <p className="text-xs text-muted-foreground">+15% this month</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Site Status</CardTitle>
                         <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>System Management</CardTitle>
                    <CardDescription>
                        This is where admin-level controls and system settings will be displayed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Admin content goes here...</p>
                </CardContent>
            </Card>

        </main>
        <Footer />
    </div>
  );
}
