
"use client";

import React, { useState } from 'react';
import { Tag, PlusCircle, MoreVertical, Search, Percent, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'Percentage Off' | 'Fixed Amount Off' | 'BOGO';
  value: number;
  status: 'Active' | 'Expired' | 'Scheduled';
  startDate: string;
  endDate?: string;
  usageCount: number;
}

const mockPromotions: Promotion[] = [
    { id: 'PROMO001', name: 'Summer Sale', code: 'SUMMER25', type: 'Percentage Off', value: 25, status: 'Active', startDate: '2024-06-01', endDate: '2024-08-31', usageCount: 152 },
    { id: 'PROMO002', name: 'New Customer Discount', code: 'WELCOME10', type: 'Fixed Amount Off', value: 10, status: 'Active', startDate: '2024-01-01', usageCount: 890 },
    { id: 'PROMO003', name: 'BOGO Edibles', code: 'BOGOEDIBLES', type: 'BOGO', value: 1, status: 'Active', startDate: '2024-07-15', endDate: '2024-07-31', usageCount: 43 },
    { id: 'PROMO004', name: 'Spring Cleaning', code: 'SPRING20', type: 'Percentage Off', value: 20, status: 'Expired', startDate: '2024-04-01', endDate: '2024-04-30', usageCount: 312 },
    { id: 'PROMO005', name: 'Holiday Special', code: 'HOLIDAY420', type: 'Percentage Off', value: 30, status: 'Scheduled', startDate: '2024-11-20', endDate: '2024-12-25', usageCount: 0 },
];

export function PromotionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const paginatedPromotions = mockPromotions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusVariant = (status: Promotion['status']) => {
      switch(status) {
          case 'Active': return 'default';
          case 'Scheduled': return 'secondary';
          case 'Expired': return 'outline';
          default: return 'outline';
      }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Tag className="mr-3 h-8 w-8" />
          Promotions & Coupons
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Promotion
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>Manage discounts, coupons, and special offers for your customers.</CardDescription>
          <div className="pt-4 flex items-center gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by promotion name or code..." 
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead><Ticket className="inline-block mr-1 h-4 w-4" />Code</TableHead>
                  <TableHead><Percent className="inline-block mr-1 h-4 w-4" />Type & Value</TableHead>
                  <TableHead>Valid Dates</TableHead>
                  <TableHead className="text-center">Usage</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPromotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell><Badge variant="outline">{promo.code}</Badge></TableCell>
                    <TableCell>
                      {promo.type} - {promo.type === 'Percentage Off' ? `${promo.value}%` : promo.type === 'Fixed Amount Off' ? `$${promo.value}` : 'Buy 1 Get 1'}
                    </TableCell>
                    <TableCell>
                      {new Date(promo.startDate).toLocaleDateString()} - {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Ongoing'}
                    </TableCell>
                    <TableCell className="text-center">{promo.usageCount}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusVariant(promo.status)}>{promo.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
