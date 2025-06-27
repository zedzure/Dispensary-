
"use client";

import React, { useState } from 'react';
import { Gift, UserSearch, Save, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '../ui/separator';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  points: number;
}

const mockCustomers: Customer[] = [
  { id: 'CUST102', name: 'Kim L.', email: 'kim.l@silzeypos.com', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', points: 2500 },
  { id: 'CUST103', name: 'John Doe', email: 'john.d@example.com', avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', points: 580 },
];

export function LoyaltyEngine() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [pointsToAdjust, setPointsToAdjust] = useState<number>(0);

    const handleSearch = () => {
        const found = mockCustomers.find(c => c.email.toLowerCase() === searchTerm.toLowerCase() || c.id.toLowerCase() === searchTerm.toLowerCase());
        if (found) {
            setSelectedCustomer(found);
            setPointsToAdjust(0);
        } else {
            toast({ title: "Customer Not Found", description: "No customer found with that email or ID.", variant: "destructive" });
            setSelectedCustomer(null);
        }
    };

    const handleSavePoints = (adjustmentType: 'issue' | 'deduct') => {
        if (!selectedCustomer || pointsToAdjust <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a positive number of points to adjust.", variant: "destructive" });
            return;
        }

        const newPoints = adjustmentType === 'issue'
            ? selectedCustomer.points + pointsToAdjust
            : selectedCustomer.points - pointsToAdjust;

        // In a real app, you'd update the backend here.
        setSelectedCustomer(prev => prev ? { ...prev, points: newPoints } : null);

        toast({
            title: "Points Adjusted",
            description: `${pointsToAdjust} points have been ${adjustmentType === 'issue' ? 'issued to' : 'deducted from'} ${selectedCustomer.name}.`,
        });
        setPointsToAdjust(0);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <Gift className="mr-3 h-8 w-8" />
                    Loyalty Engine
                </h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Find & Adjust Customer Points</CardTitle>
                    <CardDescription>Search for a customer by email or ID to manually issue or deduct loyalty points.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="Search by customer email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} className='w-full sm:w-auto'>
                            <UserSearch className="mr-2 h-4 w-4" /> Find Customer
                        </Button>
                    </div>

                    {selectedCustomer && (
                        <Card className="bg-muted/50">
                            <CardHeader>
                               <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedCustomer.avatarUrl} alt={selectedCustomer.name} />
                                        <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{selectedCustomer.name}</CardTitle>
                                        <CardDescription>{selectedCustomer.email}</CardDescription>
                                    </div>
                               </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <Separator />
                               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                  <div className="text-center sm:text-left">
                                      <p className="text-sm text-muted-foreground">Current Balance</p>
                                      <p className="text-3xl font-bold">{selectedCustomer.points.toLocaleString()} Points</p>
                                  </div>
                                  <div className="flex items-center gap-2 max-w-sm w-full">
                                    <div className='flex-1'>
                                        <Label htmlFor="points-adjust" className="sr-only">Points to Adjust</Label>
                                        <Input 
                                            id="points-adjust" 
                                            type="number" 
                                            placeholder="e.g., 100" 
                                            value={pointsToAdjust === 0 ? '' : pointsToAdjust} 
                                            onChange={(e) => setPointsToAdjust(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                     <Button size="sm" onClick={() => handleSavePoints('issue')}><Plus className='mr-1'/>Issue</Button>
                                     <Button size="sm" variant="destructive" onClick={() => handleSavePoints('deduct')}><Minus className='mr-1'/>Deduct</Button>
                                    </div>
                                  </div>
                               </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
