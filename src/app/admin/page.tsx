
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    LayoutDashboard, Users, DollarSign, Package, ShoppingCart, TrendingUp, CalendarDays, Percent, 
    Megaphone, ShieldCheck, Brain, Link as LinkIcon, Network, CalendarCheck, ClipboardCheck, Archive 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, OrderStatus } from '@/types/pos';
import { generateInitialMockOrders } from '@/lib/mockOrderData';
import { allProductsFlat, categories } from '@/lib/products';

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';

const PIE_CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  description?: string;
}

interface CampaignAnalysisData {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  impactNotes: string;
}

interface MockCampaign {
  id: string;
  name: string;
  mockDuration: string;
  targetMonth: number;
  targetYear: number;
  targetCategory?: string;
  filterFn: (order: Order) => boolean;
  analysis?: CampaignAnalysisData;
}

interface DashboardData {
    metrics: {
        totalRevenue: number;
        avgOrderValue: number;
        totalOrders: number;
        totalCustomers: number;
        avgItemsPerOrder: number;
    };
    salesData: { name: string; sales: number }[];
    revenueByCategory: { name: string; value: number }[];
    salesByPaymentMethod: { name: string; value: number }[];
    mockCampaignsData: MockCampaign[];
}

const generateDashboardData = (period: string, allCompletedOrders: Order[]): DashboardData => {
    // This function can be expanded to filter orders based on the period
    const revenue = allCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = allCompletedOrders.length;
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
    const totalCustomers = new Set(allCompletedOrders.map(o => o.customerId)).size;
    const totalItemsSold = allCompletedOrders.reduce((sum, order) => sum + order.itemCount, 0);
    const avgItemsPerOrder = totalOrders > 0 ? totalItemsSold / totalOrders : 0;
    
    // Monthly Sales Data
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

    // Revenue by Category
    const categoryRevenueMap: Record<string, number> = {};
    allCompletedOrders.forEach(order => {
      order.items.forEach(item => {
          categoryRevenueMap[item.category] = (categoryRevenueMap[item.category] || 0) + (item.price * item.quantity);
      });
    });
    const revenueByCategory = categories.map(cat => ({
      name: cat.name,
      value: parseFloat(categoryRevenueMap[cat.name]?.toFixed(2) || "0")
    })).filter(d => d.value > 0);

    // Sales by Payment Method
    const paymentMethodRevenueMap: Record<string, number> = {};
    allCompletedOrders.forEach(order => {
        const method = order.paymentMethod || 'Unknown';
        paymentMethodRevenueMap[method] = (paymentMethodRevenueMap[method] || 0) + order.totalAmount;
    });
    const salesByPaymentMethod = Object.entries(paymentMethodRevenueMap)
        .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
        .filter(d => d.value > 0)
        .sort((a,b) => b.value - a.value);

    // Mock Campaign Analysis
    const MOCK_CAMPAIGNS_DEFINITIONS: Omit<MockCampaign, 'analysis'>[] = [
        // ... (campaign definitions can be defined here or imported)
    ];
    const mockCampaignsData = MOCK_CAMPAIGNS_DEFINITIONS.map(campaignDef => {
        const campaignOrders = allCompletedOrders.filter(campaignDef.filterFn);
        let totalSales = 0;
        // ... analysis logic
        return { ...campaignDef, analysis: { totalSales, orderCount: campaignOrders.length, averageOrderValue: 0, impactNotes: '' } };
    });

    return {
        metrics: { totalRevenue: revenue, avgOrderValue, totalOrders, totalCustomers, avgItemsPerOrder },
        salesData: monthlySales,
        revenueByCategory,
        salesByPaymentMethod,
        mockCampaignsData,
    };
};

function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

function LoadingMetricCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-1/4" />
      </CardContent>
    </Card>
  )
}

function AdminAnalytics() {
  const [timePeriod, setTimePeriod] = useState('all_time');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
        if (!isMounted) return;
        let allCompletedOrders: Order[] = [];
        const staticOrders = generateInitialMockOrders();
        try {
            const storedOrders = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
            allCompletedOrders = storedOrders ? JSON.parse(storedOrders) : [];
        } catch(e) { console.error(e); }

        const combined = [...allCompletedOrders, ...staticOrders];
        const uniqueOrders = Array.from(new Map(combined.map(order => [order.id, order])).values());

        const data = generateDashboardData(timePeriod, uniqueOrders);
        setDashboardData(data);
        setIsLoading(false);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [timePeriod]);

  const renderLoadingState = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => <LoadingMetricCard key={i} />)}
      </div>
      <div className="grid gap-6 mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderContent = () => {
    if (isLoading || !dashboardData) {
        return renderLoadingState();
    }

    const { metrics, salesData, revenueByCategory, salesByPaymentMethod } = dashboardData;
    
    const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
    const chartConfigCategory = revenueByCategory.reduce((acc, cat, i) => ({...acc, [cat.name]: {label: cat.name, color: PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]}}), {} as ChartConfig);
    const chartConfigPayment = salesByPaymentMethod.reduce((acc, pay, i) => ({...acc, [pay.name]: {label: pay.name, color: PIE_CHART_COLORS[(i+2) % PIE_CHART_COLORS.length]}}), {} as ChartConfig);

    return (
       <div className="flex flex-col gap-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} icon={DollarSign} description="All time gross revenue" />
            <MetricCard title="Avg. Order Value" value={`$${metrics.avgOrderValue.toFixed(2)}`} icon={ShoppingCart} description="Average amount per transaction" />
            <MetricCard title="Total Orders" value={metrics.totalOrders.toString()} icon={TrendingUp} description="All completed orders" />
            <MetricCard title="Total Customers" value={metrics.totalCustomers.toString()} icon={Users} description="Unique customer profiles" />
            <MetricCard title="Avg Items/Order" value={metrics.avgItemsPerOrder.toFixed(1)} icon={Package} description="Average items in each sale" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Monthly sales revenue.</CardDescription>
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
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Revenue by Category</CardTitle>
                    <CardDescription>Revenue distribution across product categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    {revenueByCategory.length > 0 ? (
                        <ChartContainer config={chartConfigCategory} className="w-full h-[350px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                <Pie data={revenueByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" labelLine={false} outerRadius={120}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {revenueByCategory.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} /> ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    ) : (<div className="h-[350px] flex items-center justify-center text-muted-foreground">No category revenue data.</div>)}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Sales by Payment Method</CardTitle>
                    <CardDescription>Revenue distribution by payment methods.</CardDescription>
                </CardHeader>
                <CardContent>
                     {salesByPaymentMethod.length > 0 ? (
                        <ChartContainer config={chartConfigPayment} className="w-full h-[350px]">
                           <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                <Pie data={salesByPaymentMethod} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={120}>
                                    {salesByPaymentMethod.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} /> ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                            </PieChart>
                        </ChartContainer>
                    ) : (<div className="h-[350px] flex items-center justify-center text-muted-foreground">No payment method data.</div>)}
                </CardContent>
            </Card>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-cursive text-primary flex items-center">
                    <ShieldCheck className="mr-3 h-7 w-7" /> Compliance & Data Integrity
                </CardTitle>
                <CardDescription>Tools and information for maintaining regulatory compliance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30"><h4 className="font-semibold text-md flex items-center mb-1"><Network className="mr-2 h-5 w-5 text-primary/80" /> Real-time System & State Integration</h4><p className="text-sm text-muted-foreground">Our POS is a web-based system designed for seamless integration with state cannabis tracking systems.</p></div>
                <div className="p-4 border rounded-lg bg-muted/30"><h4 className="font-semibold text-md flex items-center mb-1"><CalendarCheck className="mr-2 h-5 w-5 text-primary/80" /> Daily Record Reconciliation</h4><p className="text-sm text-muted-foreground">Tools to reconcile daily POS transaction data with the state tracking system.</p></div>
                <div className="p-4 border rounded-lg bg-muted/30"><h4 className="font-semibold text-md flex items-center mb-1"><ClipboardCheck className="mr-2 h-5 w-5 text-primary/80" /> Weekly Physical Inventory Reconciliation</h4><p className="text-sm text-muted-foreground">Functionality to support weekly physical inventory counts and reconcile them with system records.</p></div>
                <div className="p-4 border rounded-lg bg-muted/30"><h4 className="font-semibold text-md flex items-center mb-1"><Archive className="mr-2 h-5 w-5 text-primary/80" /> Comprehensive Transaction Recording</h4><p className="text-sm text-muted-foreground">All critical transactions including sales, transfers, returns, spoilage, and destruction of cannabis are accurately recorded.</p></div>
            </CardContent>
        </Card>

      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8" />
                Admin Dashboard
            </h1>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
                <Select value={timePeriod} onValueChange={setTimePeriod} disabled={isLoading}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                    <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
        {renderContent()}
    </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminAnalytics />;
}
