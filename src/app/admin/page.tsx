
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, DollarSign, Package, ShoppingCart, Activity, CalendarDays, Percent, TrendingUp, TrendingDown, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerManagement } from '@/components/admin/customer-management';

const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
const chartConfigCustomers = { customers: { label: "New Customers", color: "hsl(var(--chart-2))" } } satisfies ChartConfig;

const PIE_CHART_COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))",
];

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  changeType?: 'positive' | 'negative';
  description?: string;
}

interface DashboardData {
    metrics: {
        totalRevenue: number;
        avgOrderValue: number;
        newCustomers: number;
        conversionRate: number;
        revenueChange: { value: string; type: 'positive' | 'negative' };
        aovChange: { value: string; type: 'positive' | 'negative' };
        customersChange: { value: string; type: 'positive' | 'negative' };
        conversionChange: { value: string; type: 'positive' | 'negative' };
    };
    salesData: { date: string; sales: number }[];
    customerData: { date: string; customers: number }[];
    topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
    salesByCatData: { name: string; value: number }[];
}

// --- Data Generation --- //
const generateDashboardData = (period: string): DashboardData => {
    let numPoints, timeUnit, maxSales, maxCustomers;
    const now = new Date();

    switch (period) {
        case 'last_7_days':
            numPoints = 7; timeUnit = 'day'; maxSales = 2500; maxCustomers = 30;
            break;
        case 'last_90_days':
            numPoints = 12; timeUnit = 'week'; maxSales = 15000; maxCustomers = 150;
            break;
        case 'last_6_months':
            numPoints = 6; timeUnit = 'month'; maxSales = 60000; maxCustomers = 500;
            break;
        case 'all_time':
            numPoints = 24; timeUnit = 'month'; maxSales = 75000; maxCustomers = 600;
            break;
        case 'last_30_days':
        default:
            numPoints = 30; timeUnit = 'day'; maxSales = 4000; maxCustomers = 50;
            break;
    }
    
    const generateTimeLabels = (num: number, unit: string) => {
        return Array.from({ length: num }, (_, i) => {
            const date = new Date();
            if (unit === 'day') date.setDate(now.getDate() - (num - 1 - i));
            if (unit === 'week') date.setDate(now.getDate() - (num - 1 - i) * 7);
            if (unit === 'month') date.setMonth(now.getMonth() - (num - 1 - i));
            
            if (unit === 'day') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (unit === 'week') return `W${i + 1}`;
            if (unit === 'month') return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            return '';
        });
    };
    const labels = generateTimeLabels(numPoints, timeUnit);

    const salesData = labels.map(label => ({ date: label, sales: Math.floor(Math.random() * maxSales * 0.7 + maxSales * 0.3) }));
    const customerData = labels.map(label => ({ date: label, customers: Math.floor(Math.random() * maxCustomers * 0.7 + maxCustomers * 0.3) }));

    const totalRevenue = salesData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalCustomers = customerData.reduce((acc, curr) => acc + curr.customers, 0);
    const avgOrderValue = totalCustomers > 0 ? totalRevenue / (totalCustomers * (Math.random() * 1.5 + 1.2)) : 0;
    const conversionRate = Math.random() * 3 + 2;

    const getChange = () => {
      const value = (Math.random() * 20 - 10);
      return { value: `${value > 0 ? '+' : ''}${value.toFixed(1)}%`, type: (value > 0 ? 'positive' : 'negative') as 'positive' | 'negative' };
    };

    const topProducts = [
        { id: 'P001', name: 'OG Kush Flower', unitsSold: Math.floor(Math.random() * 150) + 50, revenue: Math.floor(Math.random() * 2000) + 1000 },
        { id: 'P002', name: 'Blue Dream Vape', unitsSold: Math.floor(Math.random() * 120) + 40, revenue: Math.floor(Math.random() * 5000) + 2000 },
        { id: 'P003', name: 'Gourmet Gummies', unitsSold: Math.floor(Math.random() * 200) + 60, revenue: Math.floor(Math.random() * 4000) + 1500 },
        { id: 'P004', name: 'Sativa Pre-Roll Pack', unitsSold: Math.floor(Math.random() * 90) + 30, revenue: Math.floor(Math.random() * 1800) + 900 },
        { id: 'P005', name: 'CBD Tincture Max', unitsSold: Math.floor(Math.random() * 70) + 20, revenue: Math.floor(Math.random() * 3500) + 1200 },
    ].sort((a,b) => b.revenue - a.revenue);
    
    const salesByCatData = [
      { name: 'Flower', value: Math.floor(Math.random() * 10000) + 5000 }, { name: 'Vapes', value: Math.floor(Math.random() * 8000) + 4000 },
      { name: 'Edibles', value: Math.floor(Math.random() * 7000) + 3000 }, { name: 'Concentrates', value: Math.floor(Math.random() * 6000) + 2000 },
      { name: 'Pre-Rolls', value: Math.floor(Math.random() * 5000) + 1000 },
    ];
    
    return {
        metrics: { totalRevenue, avgOrderValue, newCustomers: totalCustomers, conversionRate, revenueChange: getChange(), aovChange: getChange(), customersChange: getChange(), conversionChange: getChange() },
        salesData, customerData, topProducts, salesByCatData,
    };
};

function MetricCard({ title, value, change, icon: Icon, changeType = 'positive', description }: MetricCardProps) {
  const ChangeIcon = changeType === 'positive' ? TrendingUp : TrendingDown;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            <ChangeIcon className="mr-1 h-3 w-3" /> {change}
          </p>
        )}
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
  const [timePeriod, setTimePeriod] = useState('last_30_days');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (isMounted) {
        const data = generateDashboardData(timePeriod);
        setDashboardData(data);
        setIsLoading(false);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [timePeriod]);

  const renderLoadingState = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <LoadingMetricCard key={i} />)}
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
           <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  const renderContent = () => {
    if (isLoading || !dashboardData) {
        return renderLoadingState();
    }

    const { metrics, salesData, customerData, topProducts, salesByCatData } = dashboardData;
    
    const chartConfigCategorySales = salesByCatData.reduce((acc, category, index) => {
        acc[category.name] = {
            label: category.name,
            color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]
        };
        return acc;
    }, {} as ChartConfig);

    return (
       <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString('en-US', {maximumFractionDigits:0})}`} change={metrics.revenueChange.value} changeType={metrics.revenueChange.type} icon={DollarSign} description={`vs. previous period`} />
            <MetricCard title="Average Order Value" value={`$${metrics.avgOrderValue.toFixed(2)}`} change={metrics.aovChange.value} changeType={metrics.aovChange.type} icon={ShoppingCart} />
            <MetricCard title="New Customers" value={metrics.newCustomers.toLocaleString()} change={metrics.customersChange.value} changeType={metrics.customersChange.type} icon={Users} />
            <MetricCard title="Conversion Rate" value={`${metrics.conversionRate.toFixed(2)}%`} change={metrics.conversionChange.value} changeType={metrics.conversionChange.type} icon={Percent} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Revenue over the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfigSales} className="h-[300px] w-full">
                <AreaChart accessibilityLayer data={salesData} margin={{ left: 0, right: 12, top:5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="sales" type="natural" fill="var(--color-sales)" fillOpacity={0.4} stroke="var(--color-sales)" />
                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
                </ChartContainer>
            </CardContent>
            </Card>

            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers over the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfigCustomers} className="h-[300px] w-full">
                <LineChart accessibilityLayer data={customerData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-customers)", strokeWidth:0 }} activeDot={{ r: 6 }} />
                    <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Top Selling Products</CardTitle>
                <CardDescription>Performance of most popular items by revenue.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {topProducts.slice(0,5).map(product => (
                        <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.unitsSold}</TableCell>
                        <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across categories.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                <ChartContainer config={chartConfigCategorySales} className="h-[250px] w-full max-w-xs">
                    <PieChart accessibilityLayer>
                        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                        <Pie data={salesByCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} 
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return ( <text x={x} y={y} fill="hsl(var(--primary-foreground))" textAnchor="middle" dominantBaseline="central" className="text-xs"> {`${(percent * 100).toFixed(0)}%`} </text> );
                            }}
                        >
                        {salesByCatData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                    </PieChart>
                </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

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
                    <h1 className="text-3xl font-bold font-cursive tracking-tight">Admin Portal</h1>
                    <p className="text-muted-foreground">Welcome, {user.name}. Manage your store.</p>
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

            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </TabsTrigger>
                <TabsTrigger value="customers">
                  <Users className="mr-2 h-4 w-4" /> Customers
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <AdminAnalytics />
              </TabsContent>
              <TabsContent value="customers">
                <CustomerManagement />
              </TabsContent>
            </Tabs>
            
        </main>
        <Footer />
    </div>
  );
}
