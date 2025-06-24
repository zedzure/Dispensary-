
"use client";

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, CalendarDays, DollarSign, Search, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';


interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string; // ISO string
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string; // ISO string
  avatarUrl: string;
  aiHint: string;
  tags?: string[];
}

const mockCustomers: Customer[] = Array.from({ length: 35 }, (_, i) => {
  const join = new Date();
  join.setDate(join.getDate() - Math.floor(Math.random() * 365));
  const lastOrder = new Date(join);
  lastOrder.setDate(lastOrder.getDate() + Math.floor(Math.random() * (new Date().getTime() - join.getTime()) / (1000 * 60 * 60 * 24) ));
  
  const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
  
  return {
    id: `CUST${String(101 + i).padStart(3, '0')}`,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    joinDate: join.toISOString(),
    totalSpent: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
    orderCount: Math.floor(Math.random() * 50) + 1,
    lastOrderDate: i % 3 === 0 ? undefined : lastOrder.toISOString(),
    avatarUrl: `https://placehold.co/40x40.png?text=${name.split(' ').map(n=>n[0]).join('')}`,
    aiHint: ['male avatar', 'female avatar', 'person face'][i % 3],
    tags: i % 4 === 0 ? ['VIP'] : (i % 7 === 0 ? ['New', 'High Value'] : []),
  };
});

type SortKey = keyof Customer | '';
type SortDirection = 'asc' | 'desc';

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  
  const [sortKey, setSortKey] = useState<SortKey>('joinDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valA = a[sortKey];
      const valB = b[sortKey];

      let comparison = 0;
      if (valA === undefined && valB !== undefined) comparison = -1;
      else if (valA !== undefined && valB === undefined) comparison = 1;
      else if (valA === undefined && valB === undefined) comparison = 0;
      else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  const totalPages = Math.ceil(sortedAndFilteredCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedAndFilteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds(new Set(paginatedCustomers.map(c => c.id)));
    } else {
      setSelectedCustomerIds(new Set());
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSet = new Set(selectedCustomerIds);
    if (checked) {
      newSet.add(customerId);
    } else {
      newSet.delete(customerId);
    }
    setSelectedCustomerIds(newSet);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Customer Management
        </h1>
        <Button>
          <UserPlus className="mr-2 h-5 w-5" /> Add New Customer
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Customers ({sortedAndFilteredCustomers.length})</CardTitle>
          <CardDescription>View, manage, and segment customer information.</CardDescription>
           <div className="pt-4 flex items-center gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search customers by name, email, or ID..." 
                className="pl-8"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            {selectedCustomerIds.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Actions ({selectedCustomerIds.size})</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Email Selected</DropdownMenuItem>
                  <DropdownMenuItem>Add Tag to Selected</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Selected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedCustomerIds.size === paginatedCustomers.length && paginatedCustomers.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    aria-label="Select all customers on this page"
                  />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('name')}>
                  Name <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortKey === 'name' ? 'opacity-100' : 'opacity-30'}`} />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('joinDate')}>
                  <CalendarDays className="inline-block mr-1 h-4 w-4" />Joined <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortKey === 'joinDate' ? 'opacity-100' : 'opacity-30'}`} />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort('totalSpent')}>
                  <DollarSign className="inline-block mr-1 h-4 w-4" />Spent <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortKey === 'totalSpent' ? 'opacity-100' : 'opacity-30'}`} />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} data-state={selectedCustomerIds.has(customer.id) ? "selected" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedCustomerIds.has(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, Boolean(checked))}
                      aria-label={`Select customer ${customer.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint={customer.aiHint} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{customer.name}</span>
                        {customer.tags && customer.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {customer.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.id}</div>
                  </TableCell>
                  <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No customers found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
