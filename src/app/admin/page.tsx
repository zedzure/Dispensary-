
'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, DollarSign, Package, ShoppingCart, Activity, CalendarDays, Percent, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
const chartConfigCustomers = { customers: { label: "New Customers", color: "hsl(var(--chart-2))" } } satisfies ChartConfig;
const chartConfigHourlySales = { sales: { label: "Sales", color: "hsl(var(--chart-5))" } } satisfies ChartConfig;

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
    salesByProductTypeData: { name: string; value: number; fill: string }[];
    salesByHourData: { hour: string; sales: number }[];
}

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
        { id: 'P002', name: 'Blue Dream Vape', unitsSold: Math.floor(Math.random() * 120) + 40, revenue: Math.floor(Math.random() * 5000) + 2000 },
        { id: 'P003', name: 'Gourmet Gummies', unitsSold: Math.floor(Math.random() * 200) + 60, revenue: Math.floor(Math.random() * 4000) + 1500 },
        { id: 'P001', name: 'OG Kush Flower', unitsSold: Math.floor(Math.random() * 150) + 50, revenue: Math.floor(Math.random() * 2000) + 1000 },
        { id: 'P005', name: 'CBD Tincture Max', unitsSold: Math.floor(Math.random() * 70) + 20, revenue: Math.floor(Math.random() * 3500) + 1200 },
        { id: 'P004', name: 'Sativa Pre-Roll Pack', unitsSold: Math.floor(Math.random() * 90) + 30, revenue: Math.floor(Math.random() * 1800) + 900 },
    ].sort((a,b) => b.revenue - a.revenue);
    
    const salesByCatData = [
      { name: 'Flower', value: Math.floor(Math.random() * 10000) + 5000 }, { name: 'Vapes', value: Math.floor(Math.random() * 8000) + 4000 },
      { name: 'Edibles', value: Math.floor(Math.random() * 7000) + 3000 }, { name: 'Concentrates', value: Math.floor(Math.random() * 6000) + 2000 },
      { name: 'Pre-Rolls', value: Math.floor(Math.random() * 5000) + 1000 },
    ];
    
    const salesByProductTypeData = [
        { name: 'Hybrid', value: Math.floor(Math.random() * 12000) + 6000, fill: "hsl(var(--chart-3))" },
        { name: 'Sativa', value: Math.floor(Math.random() * 9000) + 5000, fill: "hsl(var(--chart-1))" },
        { name: 'Indica', value: Math.floor(Math.random() * 8000) + 4000, fill: "hsl(var(--chart-2))" },
    ];

    const salesByHourData = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 9; // 9 AM to 8 PM
        const isPeak = (hour >= 12 && hour <= 14) || (hour >= 17 && hour <= 19);
        const randomSales = isPeak ? Math.random() * 500 + 300 : Math.random() * 200 + 50;
        return { hour: `${hour}:00`, sales: Math.floor(randomSales) };
    });

    return {
        metrics: { totalRevenue, avgOrderValue, newCustomers: totalCustomers, conversionRate, revenueChange: getChange(), aovChange: getChange(), customersChange: getChange(), conversionChange: getChange() },
        salesData, customerData, topProducts, salesByCatData, salesByProductTypeData, salesByHourData,
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
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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

    const { metrics, salesData, customerData, topProducts, salesByCatData, salesByProductTypeData, salesByHourData } = dashboardData;
    
    const chartConfigCategorySales = salesByCatData.reduce((acc, category, index) => {
        acc[category.name] = {
            label: category.name,
            color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]
        };
        return acc;
    }, {} as ChartConfig);

    const chartConfigProductType = salesByProductTypeData.reduce((acc, type) => {
        acc[type.name] = { label: type.name, color: type.fill };
        return acc;
    }, {} as ChartConfig);
    
    const chartConfigTopProducts = {
        revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
    } satisfies ChartConfig;


    return (
       <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString('en-US', {maximumFractionDigits:0})}`} change={metrics.revenueChange.value} changeType={metrics.revenueChange.type} icon={DollarSign} description={`vs. previous period`} />
            <MetricCard title="Average Order Value" value={`$${metrics.avgOrderValue.toFixed(2)}`} change={metrics.aovChange.value} changeType={metrics.aovChange.type} icon={ShoppingCart} />
            <MetricCard title="New Customers" value={metrics.newCustomers.toLocaleString()} change={metrics.customersChange.value} changeType={metrics.customersChange.type} icon={Users} />
            <MetricCard title="Conversion Rate" value={`${metrics.conversionRate.toFixed(2)}%`} change={metrics.conversionChange.value} changeType={metrics.conversionChange.type} icon={Percent} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Top Selling Products</CardTitle>
                    <CardDescription>Your most popular items by revenue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigTopProducts} className="w-full h-[300px]">
                        <BarChart accessibilityLayer data={topProducts} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} />
                            <XAxis dataKey="revenue" type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="revenue" layout="vertical" fill="var(--color-revenue)" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Sales by Category</CardTitle>
                    <CardDescription>Revenue distribution across categories.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={chartConfigCategorySales} className="h-[300px] w-full max-w-xs">
                        <PieChart accessibilityLayer>
                            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                            <Pie data={salesByCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} 
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return ( <text x={x} y={y} fill="hsl(var(--primary-foreground))" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold"> {`${(percent * 100).toFixed(0)}%`} </text> );
                                }}
                            >
                            {salesByCatData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Sales by Product Type</CardTitle>
                    <CardDescription>Revenue distribution across product types.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                <ChartContainer config={chartConfigProductType} className="h-[300px] w-full max-w-xs">
                    <PieChart accessibilityLayer>
                        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                        <Pie data={salesByProductTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                            {salesByProductTypeData.map((entry) => (<Cell key={entry.name} fill={entry.fill} />))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" />Sales by Hour</CardTitle>
                    <CardDescription>Identify peak business hours for the period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigHourlySales} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={salesByHourData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                        </BarChart>
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
  return <AdminAnalytics />;
}

