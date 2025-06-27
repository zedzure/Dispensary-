
"use client";

import React, { useState } from 'react';
import { Trash2, PlusCircle, Search, Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WasteLog {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  reason: 'Expired' | 'Damaged' | 'Return' | 'Other';
  notes?: string;
  loggedBy: string;
  date: string; // ISO string
}

const mockWasteLogs: WasteLog[] = [
    { id: 'W001', productName: 'OG Kush Flower', productId: 'P001', quantity: 5, reason: 'Expired', loggedBy: 'Admin User', date: '2024-07-20T10:00:00Z'},
    { id: 'W002', productName: 'Gourmet Gummies', productId: 'P003', quantity: 10, reason: 'Damaged', notes: 'Packaging seal broken', loggedBy: 'Inventory Ian', date: '2024-07-18T14:30:00Z'},
    { id: 'W003', productName: 'Blue Dream Vape', productId: 'P002', quantity: 2, reason: 'Return', notes: 'Customer return, device faulty', loggedBy: 'Budtender One', date: '2024-07-15T11:00:00Z'},
];


export function WasteReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  
  const paginatedLogs = mockWasteLogs.filter(log => 
      (log.productName.toLowerCase().includes(searchTerm.toLowerCase()) || log.loggedBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (reasonFilter === 'all' || log.reason.toLowerCase() === reasonFilter)
  );
  
  const uniqueReasons = Array.from(new Set(mockWasteLogs.map(log => log.reason)));

  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Trash2 className="mr-3 h-8 w-8" />
          Waste Reporting
        </h1>
         <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Log New Waste
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Waste Log</CardTitle>
          <CardDescription>Track all product waste for compliance and inventory accuracy.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by product or staff..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value) }}
              />
            </div>
             <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Reason" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    {uniqueReasons.map(reason => <SelectItem key={reason} value={reason.toLowerCase()}>{reason}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Calendar className="inline-block mr-1 h-4 w-4" />Date</TableHead>
                  <TableHead><Package className="inline-block mr-1 h-4 w-4" />Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Logged By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{log.productName} <span className="text-xs text-muted-foreground">({log.productId})</span></TableCell>
                    <TableCell className="text-center font-bold">{log.quantity}</TableCell>
                    <TableCell><Badge variant="secondary">{log.reason}</Badge></TableCell>
                    <TableCell>{log.loggedBy}</TableCell>
                    <TableCell className="text-muted-foreground">{log.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                 {paginatedLogs.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No waste logs found matching your criteria.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
