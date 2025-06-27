
"use client";

import React, { useState } from 'react';
import { UserCog, PlusCircle, Search, Mail, MoreVertical, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Budtender {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'Active' | 'Inactive';
  totalSales: number;
  ordersProcessed: number;
  onShift: boolean;
}

const mockBudtenders: Budtender[] = [
  { id: 'BUD001', name: 'Budtender One', email: 'budtenderone@gmsil.com', avatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'Active', totalSales: 125430.50, ordersProcessed: 1342, onShift: true },
  { id: 'BUD002', name: 'Casey Jones', email: 'casey.j@example.com', avatarUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'Active', totalSales: 98765.20, ordersProcessed: 1105, onShift: false },
  { id: 'BUD003', name: 'Alex Smith', email: 'alex.s@example.com', avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'Inactive', totalSales: 45012.00, ordersProcessed: 560, onShift: false },
];

export function BudtenderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const paginatedBudtenders = mockBudtenders.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <UserCog className="mr-3 h-8 w-8" />
          Budtender Management
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Budtender
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Budtenders</CardTitle>
          <CardDescription>Manage budtender accounts, view performance, and track status.</CardDescription>
          <div className="pt-4 flex items-center gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search budtenders..." 
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Budtender</TableHead>
                  <TableHead><Mail className="inline-block mr-1 h-4 w-4" />Contact</TableHead>
                  <TableHead><DollarSign className="inline-block mr-1 h-4 w-4" />Total Sales</TableHead>
                  <TableHead className="text-center"><TrendingUp className="inline-block mr-1 h-4 w-4" />Orders Processed</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBudtenders.map((budtender) => (
                  <TableRow key={budtender.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={budtender.avatarUrl} alt={budtender.name} />
                          <AvatarFallback>{budtender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{budtender.name}</span>
                          {budtender.onShift && <Badge variant="default" className="ml-2 animate-pulse">On Shift</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{budtender.email}</TableCell>
                    <TableCell>${budtender.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">{budtender.ordersProcessed.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={budtender.status === 'Active' ? 'default' : 'destructive'}>{budtender.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {/* Mobile View */}
           <div className="space-y-4 md:hidden">
            {paginatedBudtenders.map((budtender) => (
              <Card key={budtender.id} className="border-border/60">
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={budtender.avatarUrl} alt={budtender.name} />
                        <AvatarFallback>{budtender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{budtender.name}</p>
                        <p className="text-sm text-muted-foreground">{budtender.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                         <Badge variant={budtender.status === 'Active' ? 'default' : 'destructive'}>{budtender.status}</Badge>
                         {budtender.onShift && <Badge variant="default" className="animate-pulse">On Shift</Badge>}
                        </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center text-sm border-t pt-4">
                      <div className="text-muted-foreground">
                        <p>Total Sales</p>
                        <p className="font-bold text-foreground">${budtender.totalSales.toLocaleString()}</p>
                      </div>
                      <div className="text-muted-foreground text-right">
                        <p>Orders</p>
                        <p className="font-bold text-foreground">{budtender.ordersProcessed.toLocaleString()}</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
