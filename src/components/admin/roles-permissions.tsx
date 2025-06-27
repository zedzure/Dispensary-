
"use client";

import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, User, KeyRound, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Role {
  id: string;
  name: 'Admin' | 'Budtender' | 'Manager' | 'Inventory Specialist';
  description: string;
  userCount: number;
}

const allPermissions = {
    'Dashboard': ['View Analytics'],
    'Orders': ['View Orders', 'Edit Orders', 'Refund Orders'],
    'Inventory': ['View Products', 'Manage Products', 'Manage Categories'],
    'Customers': ['View Customers', 'Edit Customers', 'Manage Loyalty Points'],
    'Staff': ['View Staff', 'Manage Staff'],
    'Reports': ['View All Reports', 'Export Reports'],
    'Settings': ['Manage General Settings', 'Manage Billing', 'Manage Integrations'],
};

const rolePermissions: Record<Role['name'], string[]> = {
    'Admin': Object.values(allPermissions).flat(),
    'Manager': ['View Analytics', 'View Orders', 'Edit Orders', 'View Products', 'Manage Products', 'View Customers', 'View Staff', 'Manage Staff', 'View All Reports'],
    'Budtender': ['View Orders', 'View Products', 'View Customers', 'Manage Loyalty Points'],
    'Inventory Specialist': ['View Products', 'Manage Products', 'Manage Categories', 'View All Reports']
};

const mockRoles: Role[] = [
  { id: 'R001', name: 'Admin', description: 'Full access to all system features.', userCount: 1 },
  { id: 'R002', name: 'Manager', description: 'Manages daily operations, staff, and inventory.', userCount: 2 },
  { id: 'R003', name: 'Budtender', description: 'Handles customer transactions and provides product expertise.', userCount: 5 },
  { id: 'R004', name: 'Inventory Specialist', description: 'Manages stock levels, receiving, and audits.', userCount: 1 },
];


export function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role>(mockRoles[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <ShieldCheck className="mr-3 h-8 w-8" />
          Roles & Permissions
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Role
        </Button>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>All Roles</CardTitle>
                        <CardDescription>Select a role to view or edit its permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right"><User className="inline-block mr-1 h-4 w-4" />Users</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map(role => (
                                    <TableRow 
                                        key={role.id} 
                                        className="cursor-pointer" 
                                        onClick={() => setSelectedRole(role)}
                                        data-state={selectedRole.id === role.id ? 'selected' : ''}
                                    >
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell className="text-right">{role.userCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary"/>Permissions for {selectedRole.name}</CardTitle>
                        <CardDescription>{selectedRole.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(allPermissions).map(([category, permissions]) => (
                            <div key={category}>
                                <h4 className="font-semibold mb-2">{category}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                    {permissions.map(permission => (
                                        <div key={permission} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`${selectedRole.id}-${permission}`} 
                                                checked={rolePermissions[selectedRole.name].includes(permission)}
                                                disabled={selectedRole.name === 'Admin'}
                                            />
                                            <Label htmlFor={`${selectedRole.id}-${permission}`} className="font-normal text-sm text-muted-foreground">{permission}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardContent>
                        <Button disabled={selectedRole.name === 'Admin'}>
                            <Save className="mr-2 h-4 w-4" /> Save Permissions for {selectedRole.name}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
