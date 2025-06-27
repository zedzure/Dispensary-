
"use client";

import React, { useState } from 'react';
import { Briefcase, PlusCircle, Search, Mail, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Admin' | 'Manager' | 'Inventory Specialist' | 'Budtender';
  status: 'Active' | 'Inactive';
}

const mockStaff: StaffMember[] = [
  { id: 'STAFF001', name: 'Admin User', email: 'k.lunaris@gmail.com', avatarUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'Admin', status: 'Active' },
  { id: 'STAFF002', name: 'Budtender One', email: 'budtenderone@gmsil.com', avatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'Budtender', status: 'Active' },
  { id: 'STAFF003', name: 'Manager Mike', email: 'mike.m@example.com', avatarUrl: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'Manager', status: 'Active' },
  { id: 'STAFF004', name: 'Inventory Ian', email: 'ian.i@example.com', avatarUrl: 'https://images.pexels.com/photos/4100670/pexels-photo-4100670.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'Inventory Specialist', status: 'Active' },
  { id: 'STAFF005', name: 'Former Employee', email: 'former@example.com', avatarUrl: 'https://placehold.co/40x40.png', role: 'Budtender', status: 'Inactive' },
];

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const paginatedStaff = mockStaff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Briefcase className="mr-3 h-8 w-8" />
          Staff Management
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Staff
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>Manage accounts, roles, and permissions for all staff.</CardDescription>
          <div className="pt-4 flex items-center gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search staff members..." 
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
                  <TableHead><Mail className="inline-block mr-1 h-4 w-4" />Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                          <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell><Badge variant="secondary">{staff.role}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge variant={staff.status === 'Active' ? 'default' : 'destructive'}>{staff.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate Account</DropdownMenuItem>
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
