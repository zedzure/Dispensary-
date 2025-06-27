
"use client";

import React, { useState } from 'react';
import { Landmark, PlusCircle, MoreVertical, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { allProductsFlat, categories } from '@/lib/products';

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'Percentage' | 'Fixed';
  appliesTo: 'All Products' | 'Specific Categories';
  categories?: string[];
}

const mockTaxRules: TaxRule[] = [
  { id: 'TAX001', name: 'State Cannabis Tax', rate: 15, type: 'Percentage', appliesTo: 'All Products' },
  { id: 'TAX002', name: 'Local Cannabis Tax', rate: 5.5, type: 'Percentage', appliesTo: 'All Products' },
  { id: 'TAX003', name: 'Medical Patient Exemption', rate: 0, type: 'Percentage', appliesTo: 'All Products' },
  { id: 'TAX004', name: 'Edibles & Concentrates Excise Tax', rate: 2.5, type: 'Percentage', appliesTo: 'Specific Categories', categories: ['Edibles', 'Concentrates'] },
];

export function TaxRules() {
  const [taxRules, setTaxRules] = useState<TaxRule[]>(mockTaxRules);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Landmark className="mr-3 h-8 w-8" />
          Tax Rules
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Tax Rule
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Tax Rules</CardTitle>
          <CardDescription>Define and manage all applicable taxes for your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead className="text-right"><Percent className="inline-block mr-1 h-4 w-4" />Rate</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="text-right">{rule.rate.toFixed(2)}{rule.type === 'Percentage' ? '%' : ''}</TableCell>
                    <TableCell>
                      {rule.appliesTo === 'All Products' ? (
                        <Badge variant="secondary">All Products</Badge>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {rule.categories?.map(cat => <Badge key={cat}>{cat}</Badge>)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Rule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
