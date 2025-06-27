
"use client";

import React, { useState, useMemo } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, Package, Layers3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allProductsFlat, categories } from '@/lib/products';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  unitsSold: { label: "Units Sold", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function UsageReport() {
    
    const reportData = useMemo(() => {
        const productUsage = allProductsFlat.map(p => ({
            ...p,
            unitsSold: Math.floor(Math.random() * 200) + 20,
            previousUnitsSold: Math.floor(Math.random() * 200) + 20,
        })).map(p => ({
            ...p,
            trend: p.unitsSold - p.previousUnitsSold,
        }));
        
        const topTrending = [...productUsage].sort((a,b) => b.trend - a.trend).slice(0, 5);
        const bottomTrending = [...productUsage].sort((a,b) => a.trend - b.trend).slice(0, 5);

        const categoryUsage = categories
            .filter(c => c.name !== 'Deals')
            .map(c => {
                const categoryProducts = productUsage.filter(p => p.category === c.name);
                const totalUnits = categoryProducts.reduce((sum, p) => sum + p.unitsSold, 0);
                return { name: c.name, unitsSold: totalUnits };
            }).sort((a,b) => b.unitsSold - a.unitsSold);

        return { topTrending, bottomTrending, categoryUsage };
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <FileText className="mr-3 h-8 w-8" />
                    Product Usage Report
                </h1>
                 <Button>
                    <Download className="mr-2 h-5 w-5" /> Export
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-600"><TrendingUp className="mr-2"/>Top Trending Products</CardTitle>
                        <CardDescription>Products with the largest increase in sales units.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Package className="inline-block mr-1 h-4 w-4"/>Product</TableHead>
                                    <TableHead className="text-right">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.topTrending.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">+{p.trend} units</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-red-600"><TrendingDown className="mr-2"/>Bottom Trending Products</CardTitle>
                        <CardDescription>Products with the largest decrease in sales units.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Package className="inline-block mr-1 h-4 w-4"/>Product</TableHead>
                                    <TableHead className="text-right">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.bottomTrending.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right font-bold text-red-600">{p.trend} units</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Layers3 className="mr-2"/>Usage by Category</CardTitle>
                    <CardDescription>Total units sold across all product categories.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="w-full h-[400px]">
                        <BarChart accessibilityLayer data={reportData.categoryUsage} layout="vertical" margin={{ right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120}/>
                            <XAxis dataKey="unitsSold" type="number" />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="unitsSold" layout="vertical" fill="var(--color-unitsSold)" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
