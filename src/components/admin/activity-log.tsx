
"use client";

import React, { useState } from 'react';
import { History, Search, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityLog {
  id: string;
  user: { name: string; avatarUrl: string; };
  action: string;
  details?: string;
  timestamp: string; // ISO string
}

const mockLogs: ActivityLog[] = Array.from({ length: 50 }, (_, i) => {
  const users = [ { name: 'Admin User', avatarUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400' }, { name: 'Budtender One', avatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400' }, { name: 'Kim L.', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }];
  const actions = [ 'Logged in', 'Updated Product', 'Processed Order', 'Issued Loyalty Points', 'Generated Report', 'Logged out' ];
  const date = new Date();
  date.setHours(date.getHours() - i * 2);
  
  return {
    id: `LOG${1000 + i}`,
    user: users[i % users.length],
    action: actions[i % actions.length],
    details: actions[i % actions.length] === 'Updated Product' ? 'Product ID: P002' : (actions[i % actions.length] === 'Processed Order' ? 'Order ID: #G12346' : undefined),
    timestamp: date.toISOString(),
  };
});

export function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredLogs = mockLogs.filter(log => {
      const searchTermMatch = log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
      const userFilterMatch = userFilter === 'all' || log.user.name === userFilter;
      const actionFilterMatch = actionFilter === 'all' || log.action === actionFilter;
      return searchTermMatch && userFilterMatch && actionFilterMatch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const uniqueUsers = Array.from(new Set(mockLogs.map(log => log.user.name)));
  const uniqueActions = Array.from(new Set(mockLogs.map(log => log.action)));

  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <History className="mr-3 h-8 w-8" />
          Activity Log
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>System & User Activity</CardTitle>
          <CardDescription>Review all system events and user actions.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search logs by user, action, or details..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={userFilter} onValueChange={value => { setUserFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by User" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                  </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={value => { setActionFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Action" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[250px]'><User className="inline-block mr-1 h-4 w-4" />User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right"><Calendar className="inline-block mr-1 h-4 w-4" />Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                       <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={log.user.avatarUrl} alt={log.user.name} />
                          <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-semibold">{log.action}</span></TableCell>
                    <TableCell className="text-muted-foreground">{log.details || 'N/A'}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                 {paginatedLogs.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No logs found matching your criteria.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
