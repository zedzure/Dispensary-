
"use client";

import React, { useState, useMemo } from 'react';
import { Warehouse, TrendingDown, DollarSign, Search, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product';
import { allProductsFlat } from '@/lib/products';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfigTopProducts = {
    stock: { label: 'Stock', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const MetricCard = ({ title, value, icon: Icon, description, valueClassName }: { title: string; value: string; icon: React.ElementType; description?: string; valueClassName?: string; }) => (
    <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

export function InventoryReport() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const inventoryData = useMemo(() => {
        return allProductsFlat.map(p => ({
            ...p,
            stockValue: (p.stock ?? 0) * (p.price ?? 0),
            turnover: Math.random() * 5 + 1, // mock
        })).sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    }, []);

    const filteredData = inventoryData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const totalStock = useMemo(() => inventoryData.reduce((acc, p) => acc + (p.stock ?? 0), 0), [inventoryData]);
    const totalStockValue = useMemo(() => inventoryData.reduce((acc, p) => acc + p.stockValue, 0), [inventoryData]);
    const lowStockItems = useMemo(() => inventoryData.filter(p => (p.stock ?? 0) < 20).length, [inventoryData]);
    const outOfStockItems = useMemo(() => inventoryData.filter(p => (p.stock ?? 0) === 0).length, [inventoryData]);

    const topLowStockProducts = inventoryData.filter(p => p.stock! > 0 && p.stock! < 50).slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <Warehouse className="mr-3 h-8 w-8" />
                    Inventory Report
                </h1>
                 <Button>
                    <Download className="mr-2 h-5 w-5" /> Export Report
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Stock Units" value={totalStock.toLocaleString()} icon={Warehouse} />
                <MetricCard title="Total Stock Value" value={`$${totalStockValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} />
                <MetricCard title="Low Stock Items" value={lowStockItems.toString()} icon={TrendingDown} description="Items with less than 20 units." valueClassName="text-orange-500" />
                <MetricCard title="Out of Stock Items" value={outOfStockItems.toString()} icon={AlertTriangle} description="Items completely out of stock." valueClassName="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Lowest Stock Products</CardTitle>
                        <CardDescription>Top 5 products that are running low on inventory (but not out of stock).</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigTopProducts} className="w-full h-[300px]">
                            <BarChart accessibilityLayer data={topLowStockProducts} layout="vertical" margin={{ right: 20 }}>
                                <CartesianGrid horizontal={false} />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={150} />
                                <XAxis dataKey="stock" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="stock" layout="vertical" fill="var(--color-stock)" radius={5} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Out of Stock Products</CardTitle>
                        <CardDescription>All products that are currently unavailable.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow><TableHead>Product</TableHead><TableHead>ID</TableHead></TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventoryData.filter(p => p.stock === 0).map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{p.id}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Detailed Inventory List</CardTitle>
                    <CardDescription>Complete list of all products and their stock levels.</CardDescription>
                     <div className="pt-4 flex items-center gap-3">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search products..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Stock</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Stock Value</TableHead>
                                    <TableHead className="text-right">Turnover (mock)</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-center font-bold">{p.stock}</TableCell>
                                        <TableCell className="text-right">${p.price?.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${p.stockValue.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{p.turnover.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={p.stock === 0 ? 'destructive' : p.stock! < 20 ? 'secondary' : 'default'}>
                                                {p.stock === 0 ? 'Out of Stock' : p.stock! < 20 ? 'Low Stock' : 'In Stock'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
