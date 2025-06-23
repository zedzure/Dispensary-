
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, ShoppingBag, BarChart, LogOut, Settings, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetailDialog } from '@/components/order-detail-dialog';

// Define types for better readability
type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

export type BudtenderOrder = {
    id: string;
    customer: string;
    total: number;
    status: string;
    items: OrderItem[];
};

// Mock data for the dashboard
const recentOrders: BudtenderOrder[] = [
  { 
    id: '#G12346', 
    customer: 'Alice Johnson', 
    total: 85.00, 
    status: 'Pending', 
    items: [
        { name: 'OG Kush', quantity: 1, price: 45.00 },
        { name: 'Pre-roll Pack', quantity: 1, price: 32.50 },
    ] 
  },
  { 
    id: '#G12345', 
    customer: 'Kim L.', 
    total: 75.50, 
    status: 'Completed', 
    items: [
        { name: 'Blue Dream Vape', quantity: 1, price: 40.00 },
        { name: 'CBD Tincture', quantity: 1, price: 30.00 },
    ] 
  },
  { 
    id: '#G12344', 
    customer: 'Bob Williams', 
    total: 50.00, 
    status: 'Completed', 
    items: [
        { name: 'Gummy Edibles', quantity: 2, price: 23.00 },
    ]
  },
  { 
    id: '#G12343', 
    customer: 'Charlie Brown', 
    total: 150.25, 
    status: 'Pending', 
    items: [
        { name: 'Vape Pen', quantity: 2, price: 35.00 },
        { name: 'Flower Jar (3.5g)', quantity: 1, price: 65.00 },
    ]
  },
];

const topProducts = [
    { name: "OG Kush", category: "Flower", sales: 124 },
    { name: "Gummy Edibles", category: "Edibles", sales: 98 },
    { name: "Vape Pen", category: "Vapes", sales: 76 },
]

export default function BudtenderDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<BudtenderOrder | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'budtender')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'budtender') {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div>
                    <Skeleton className="h-80 w-full rounded-lg" />
                </div>
            </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const totalItemsInOrder = (items: OrderItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Budtender Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}. Here's your dispensary overview.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
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
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">+18.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">+5 vs yesterday</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <BarChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$92.50</div>
                <p className="text-xs text-muted-foreground">-2.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>A list of the most recent customer orders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="text-center">{totalItemsInOrder(order.items)}</TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                              <Badge 
                                  variant={order.status === 'Pending' ? 'destructive' : (order.status === 'Completed' ? 'default' : 'secondary')}
                                  className={order.status === 'Pending' ? 'animate-pulse' : ''}
                              >
                                  {order.status}
                              </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Your most popular items this month.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topProducts.map((product) => (
                      <div key={product.name} className="flex items-center">
                          <p className="text-sm font-medium flex-1">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sales} units</p>
                      </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <OrderDetailDialog order={selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)} />
    </>
  );
}
