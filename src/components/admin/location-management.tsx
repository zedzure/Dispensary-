
"use client";

import React, { useState } from 'react';
import { Map, PlusCircle, MoreVertical, Globe, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'Open' | 'Closed' | 'Opening Soon';
  type: 'Retail' | 'Warehouse' | 'Corporate';
}

const mockLocations: Location[] = [
  { id: 'LOC001', name: 'Downtown Flagship', address: '420 S. Main St', city: 'Denver', state: 'CO', zip: '80202', status: 'Open', type: 'Retail' },
  { id: 'LOC002', name: 'Northside Dispensary', address: '123 High St', city: 'Boulder', state: 'CO', zip: '80302', status: 'Open', type: 'Retail' },
  { id: 'LOC003', name: 'Central Warehouse', address: '555 Distribution Ave', city: 'Aurora', state: 'CO', zip: '80011', status: 'Open', type: 'Warehouse' },
  { id: 'LOC004', name: 'South Metro (Coming Soon)', address: '789 S Broadway', city: 'Englewood', state: 'CO', zip: '80113', status: 'Opening Soon', type: 'Retail' },
];


export function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Map className="mr-3 h-8 w-8" />
          Location Management
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Location
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>Manage all your business locations, including dispensaries and warehouses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead><Briefcase className="inline-block mr-1 h-4 w-4" />Type</TableHead>
                  <TableHead className="text-center"><Globe className="inline-block mr-1 h-4 w-4" />Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{`${location.address}, ${location.city}, ${location.state} ${location.zip}`}</TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={location.status === 'Open' ? 'default' : location.status === 'Closed' ? 'destructive' : 'secondary'}>
                        {location.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Manage Staff</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Archive Location</DropdownMenuItem>
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
