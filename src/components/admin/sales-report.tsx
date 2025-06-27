
"use client";

import React, { useState, useMemo } from 'react';
import { BarChart3, Download, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allProductsFlat, categories } from '@/lib/products';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

const PIE_CHART_COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))",
];

const MetricCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType; }) => (
    <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export function SalesReport() {
    const [timePeriod, setTimePeriod] = useState('last_30_days');

    const reportData = useMemo(() => {
        const factor = timePeriod === 'last_7_days' ? 1 : (timePeriod === 'last_90_days' ? 6 : 4);
        const numPoints = timePeriod === 'last_7_days' ? 7 : (timePeriod === 'last_90_days' ? 12 : 30);
        
        const totalRevenue = (Math.random() * 50000 + 20000) * factor;
        const totalOrders = Math.floor(totalRevenue / (Math.random() * 50 + 75));

        const salesData = Array.from({length: numPoints}, (_, i) => ({
            date: `Day ${i+1}`, sales: Math.floor(Math.random() * (totalRevenue/numPoints) + (totalRevenue/numPoints)*0.5)
        }));
        
        const topProducts = [...allProductsFlat]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map(p => ({ ...p, unitsSold: Math.floor(Math.random() * 50 * factor) + 10, revenue: (p.price ?? 0) * (Math.floor(Math.random() * 50 * factor) + 10) }))
            .sort((a,b) => b.revenue - a.revenue);
            
        const salesByCatData = categories
            .filter(c => c.name !== 'Deals')
            .map(c => ({ name: c.name, value: Math.floor(Math.random() * (totalRevenue/categories.length)) + 500 }));
            
        return {
            totalRevenue, totalOrders, avgOrderValue: totalRevenue / totalOrders, salesData, topProducts, salesByCatData
        };
    }, [timePeriod]);

    const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
    const chartConfigCategorySales = reportData.salesByCatData.reduce((acc, category, index) => {
        acc[category.name] = {
            label: category.name,
            color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]
        };
        return acc;
    }, {} as ChartConfig);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <BarChart3 className="mr-3 h-8 w-8" />
                    Sales Report
                </h1>
                 <div className="flex items-center gap-2">
                     <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Download className="mr-2 h-5 w-5" /> Export
                    </Button>
                 </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard title="Total Revenue" value={`$${reportData.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} />
                <MetricCard title="Total Orders" value={reportData.totalOrders.toLocaleString()} icon={BarChart3} />
                <MetricCard title="Average Order Value" value={`$${reportData.avgOrderValue.toFixed(2)}`} icon={DollarSign} />
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                    <CardDescription>Revenue trend for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigSales} className="h-[350px] w-full">
                        <AreaChart data={reportData.salesData} margin={{ left: 0, right: 12, top:5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Area dataKey="sales" type="natural" fill="var(--color-sales)" fillOpacity={0.4} stroke="var(--color-sales)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="shadow-lg lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Most popular items by revenue for the period.</CardDescription>
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
                                {reportData.topProducts.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right">{p.unitsSold}</TableCell>
                                        <TableCell className="text-right">${p.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="shadow-lg lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Revenue distribution across product categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[300px]">
                        <ChartContainer config={chartConfigCategorySales} className="w-full max-w-xs">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                                <Pie data={reportData.salesByCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {reportData.salesByCatData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
