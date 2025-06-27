
'use client';

import React, { useState, useEffect } from 'react';
import { 
    DollarSign, Users, Package, LayoutDashboard, UserPlus, PackageSearch, ListChecks, FileText, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, InventoryItem, UserProfile } from '@/types/pos';
import { generateInitialMockOrders } from '@/lib/mockOrderData';
import { generateMockInventory } from '@/lib/mockInventory';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/lib/mockCustomers';

// --- STORAGE KEYS ---
const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';
const INVENTORY_STORAGE_KEY = 'silzeyPosInventory'; // Corrected key from user code
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';

// --- HELPERS ---
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const isToday = (isoDateString?: string) => {
  if (!isoDateString) return false;
  try {
    return new Date(isoDateString).toISOString().split('T')[0] === getTodayDateString();
  } catch (e) {
    return false; 
  }
};

// --- SUB-COMPONENTS ---

// Re-implementing StatCard based on user's code and existing MetricCard
function StatCard({ title, value, icon: Icon, description }: { title: string; value: string; icon: React.ElementType; description: string; }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// Loading state for the StatCard
function LoadingStatCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  );
}


// --- MAIN DASHBOARD COMPONENT ---

function AdminDashboard() {
  // State for all dashboard data
  const [stats, setStats] = useState({
    todaysRevenue: 0,
    newCustomersToday: 0,
    totalProducts: 0,
    productsInStock: 0,
    openOrdersCount: 0,
    revenueChange: 0,
    newCustomerChange: 0,
  });
  const [salesData, setSalesData] = useState<{name: string; sales: number}[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (!isMounted) return;

      // --- Data Loading from localStorage ---
      let allCompletedOrders: Order[] = [];
      let allUsers: UserProfile[] = [...mockCustomers];
      let allInventory: InventoryItem[] = generateMockInventory();
      let pendingOrders: Order[] = [];

      try {
        const storedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
        const staticOrders = generateInitialMockOrders();
        const storedOrders = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
        const combined = [...storedOrders, ...staticOrders];
        allCompletedOrders = Array.from(new Map(combined.map(order => [order.id, order])).values());
      } catch(e) { console.error("Error loading completed orders", e); }
      
      try {
        const storedUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        if(storedUsersRaw) {
          const storedUsers = JSON.parse(storedUsersRaw);
          const userMap = new Map(allUsers.map(u => [u.id, u]));
          storedUsers.forEach((u: UserProfile) => userMap.set(u.id, u));
          allUsers = Array.from(userMap.values());
        }
      } catch(e) { console.error("Error loading users", e); }

      try {
        allInventory = generateMockInventory(); // This function handles localStorage internally
      } catch (e) { console.error("Error loading inventory", e); }

      try {
        const storedPendingRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
        pendingOrders = storedPendingRaw ? JSON.parse(storedPendingRaw) : [];
      } catch (e) { console.error("Error loading pending orders", e); }

      // --- Calculations ---
      const todaysRevenue = allCompletedOrders
        .filter(o => o.processedAt && isToday(o.processedAt))
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const newCustomersToday = allUsers
        .filter(u => u.memberSince && isToday(u.memberSince))
        .length;
      
      const totalProducts = allInventory.length;
      const productsInStock = allInventory.filter(i => i.stock > 0).length;
      
      const openOrdersCount = pendingOrders.length;
      
      // --- Monthly Sales Data ---
      const salesByMonth: { [key: string]: number } = {};
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      allCompletedOrders.forEach(order => {
          const date = new Date(order.processedAt || order.orderDate);
          const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.totalAmount;
      });
      const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
      });
      const monthlySales = sortedMonths.slice(-12).map(monthKey => ({
          name: monthKey.split(' ')[0],
          sales: salesByMonth[monthKey]
      }));

      // --- Set State ---
      setStats({
        todaysRevenue,
        newCustomersToday,
        totalProducts,
        productsInStock,
        openOrdersCount,
        revenueChange: Math.floor(Math.random() * 30 - 10), // Mock
        newCustomerChange: Math.floor(Math.random() * 5 - 2), // Mock
      });
      setSalesData(monthlySales);
      setRecentOrders(allCompletedOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5));
      setIsLoading(false);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  
  const formatRevenueChange = (change: number) => `${change >= 0 ? '+' : ''}${change}% from yesterday`;
  const formatCustomerChange = (change: number) => `${change >= 0 ? '+' : ''}${change} today`;

  const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--chart-1))" } };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <LoadingStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><Skeleton className="h-[450px] w-full" /></div>
            <div className="space-y-8 lg:col-span-1"><Skeleton className="h-[200px] w-full" /><Skeleton className="h-[200px] w-full" /></div>
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Revenue" value={`$${stats.todaysRevenue.toFixed(2)}`} icon={DollarSign} description={formatRevenueChange(stats.revenueChange)} />
        <StatCard title="New Customers" value={stats.newCustomersToday.toString()} icon={UserPlus} description={formatCustomerChange(stats.newCustomerChange)} />
        <StatCard title="Total Products" value={stats.totalProducts.toString()} icon={PackageSearch} description={`${stats.productsInStock} in stock`} />
        <StatCard title="Open Orders" value={stats.openOrdersCount.toString()} icon={ListChecks} description={`${stats.openOrdersCount} require attention`} />
      </div>

      {/* Main Content Grid (Chart and Management/Reports Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="font-cursive text-primary">Sales Overview</CardTitle>
                    <CardDescription>Monthly sales revenue from completed orders.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfigSales} className="w-full h-[350px]">
                    <BarChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) >= 1000 ? `${Number(value)/1000}k` : value}`} />
                        <ChartTooltip cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }} content={<ChartTooltipContent />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-cursive text-primary">
                <FileText className="mr-2 h-5 w-5" /> Quick Reports
              </CardTitle>
              <CardDescription>View detailed analytics reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/sales">Sales Reports</Link></Button>
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/inventory">Inventory Reports</Link></Button>
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/customer-insights">Customer Insights</Link></Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-cursive text-primary">
                <Settings className="mr-2 h-5 w-5" /> Management
              </CardTitle>
              <CardDescription>Access key management areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/products">Manage Inventory</Link></Button>
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/users">View Customer List</Link></Button>
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/settings">Store Settings</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-cursive text-primary">Recent Orders</CardTitle>
            <CardDescription>A list of the most recently completed orders.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {recentOrders.map(order => (
                       <TableRow key={order.id}>
                           <TableCell className="font-medium">{order.id}</TableCell>
                           <TableCell>{order.customerName}</TableCell>
                           <TableCell><Badge variant="default">{order.status}</Badge></TableCell>
                           <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                       </TableRow>
                   ))}
                   {recentOrders.length === 0 && (
                       <TableRow>
                           <TableCell colSpan={4} className="h-24 text-center">No recent orders found.</TableCell>
                       </TableRow>
                   )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
