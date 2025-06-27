
"use client";

import React, { useState, useMemo } from 'react';
import { Gift, BarChart3, TrendingUp, TrendingDown, Users, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  issued: { label: "Issued", color: "hsl(var(--chart-1))" },
  redeemed: { label: "Redeemed", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const MetricCard = ({ title, value, icon: Icon, change }: { title: string; value: string; icon: React.ElementType; change?: string; }) => (
    <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </CardContent>
    </Card>
);

const mockLoyaltyData = {
    totalPointsIssued: 125600,
    totalPointsRedeemed: 45200,
    activeMembers: 1230,
    redemptionRate: 36, // percent
    chartData: Array.from({length: 12}, (_, i) => {
        const month = new Date(0, i).toLocaleString('default', { month: 'short' });
        const issued = Math.floor(Math.random() * 5000 + 8000);
        const redeemed = Math.floor(Math.random() * 2000 + 3000);
        return { month, issued, redeemed };
    }),
    topMembers: [
        { id: 'CUST102', name: 'Kim L.', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', points: 2500, redeemed: 1500 },
        { id: 'CUST103', name: 'John Doe', avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', points: 580, redeemed: 5000 },
        { id: 'CUST104', name: 'Jane Smith', avatarUrl: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400', points: 1800, redeemed: 1200 },
        { id: 'CUST105', name: 'Mike Brown', avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400', points: 1500, redeemed: 800 },
    ].sort((a,b) => b.redeemed - a.redeemed),
};

export function LoyaltyReport() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <BarChart3 className="mr-3 h-8 w-8" />
                    Loyalty Report
                </h1>
                <Button>
                    <Download className="mr-2 h-5 w-5" /> Export Report
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Points Issued" value={mockLoyaltyData.totalPointsIssued.toLocaleString()} icon={TrendingUp} change="+12% from last month" />
                <MetricCard title="Total Points Redeemed" value={mockLoyaltyData.totalPointsRedeemed.toLocaleString()} icon={TrendingDown} change="+8% from last month" />
                <MetricCard title="Active Loyalty Members" value={mockLoyaltyData.activeMembers.toLocaleString()} icon={Users} />
                <MetricCard title="Redemption Rate" value={`${mockLoyaltyData.redemptionRate}%`} icon={Gift} description="Points redeemed vs. issued" />
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Points Activity Over Time</CardTitle>
                    <CardDescription>Monthly trends for points issued vs. redeemed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <AreaChart accessibilityLayer data={mockLoyaltyData.chartData} margin={{ left: 0, right: 12, top:5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Area dataKey="issued" type="natural" fill="var(--color-issued)" fillOpacity={0.4} stroke="var(--color-issued)" />
                            <Area dataKey="redeemed" type="natural" fill="var(--color-redeemed)" fillOpacity={0.4} stroke="var(--color-redeemed)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Top Loyalty Members</CardTitle>
                    <CardDescription>Customers who have redeemed the most points.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">Points Redeemed</TableHead>
                                    <TableHead className="text-right">Current Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLoyaltyData.topMembers.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{member.redeemed.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{member.points.toLocaleString()}</TableCell>
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
