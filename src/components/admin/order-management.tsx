
"use client";

import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, MoreVertical, Hash, User, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  customerName: string;
  date: string; // ISO String
  total: number;
  status: 'Pending' | 'Completed' | 'Shipped' | 'Cancelled';
  itemCount: number;
}

const mockOrders: Order[] = Array.from({ length: 40 }, (_, i) => {
    const statuses: Order['status'][] = ['Pending', 'Completed', 'Shipped', 'Cancelled'];
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
        id: `#G12${String(346 - i).padStart(3, '0')}`,
        customerName: ['Alice Johnson', 'Kim L.', 'Bob Williams', 'Charlie Brown', 'Dana Scully'][i % 5],
        date: date.toISOString(),
        total: Math.random() * 200 + 20,
        status: statuses[i % statuses.length],
        itemCount: Math.floor(Math.random() * 5) + 1,
    };
});

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const filteredOrders = mockOrders.filter(order =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || order.status.toLowerCase() === statusFilter)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const getStatusVariant = (status: Order['status']) => {
      switch(status) {
          case 'Completed':
          case 'Shipped':
              return 'default';
          case 'Pending':
              return 'secondary';
          case 'Cancelled':
              return 'destructive';
          default:
              return 'outline';
      }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" />
          Order Management
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
           <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by Order ID or Customer Name..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
             <Select value={statusFilter} onValueChange={value => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
           {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Hash className="inline-block mr-1 h-4 w-4" />Order ID</TableHead>
                  <TableHead><User className="inline-block mr-1 h-4 w-4" />Customer</TableHead>
                  <TableHead><Calendar className="inline-block mr-1 h-4 w-4" />Date</TableHead>
                  <TableHead className="text-right"><DollarSign className="inline-block mr-1 h-4 w-4" />Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Print Receipt</DropdownMenuItem>
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
            {paginatedOrders.map((order) => (
               <Card key={order.id} className="border-border/60">
                 <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </CardHeader>
                 <CardContent className="p-4 pt-0">
                   <div className="flex justify-between items-center text-sm border-t pt-4">
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                        <div className='text-right'>
                            <p className="text-sm text-muted-foreground">{order.itemCount} items</p>
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        </div>
                   </div>
                 </CardContent>
               </Card>
            ))}
          </div>
          {paginatedOrders.length === 0 && (
            <div className="h-24 text-center flex items-center justify-center text-muted-foreground">
                No orders found matching your criteria.
            </div>
          )}
        </CardContent>
         {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
