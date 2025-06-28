
"use client";

import React, { useState } from 'react';
import { CreditCard, Save, ToggleRight, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

const mockGateways: PaymentGateway[] = [
  { id: 'stripe', name: 'Stripe', description: 'Accept credit cards, debit cards, and popular payment methods.', logo: '/placeholder.svg', connected: true },
  { id: 'paypal', name: 'PayPal', description: 'Offer PayPal checkout for a fast and secure payment experience.', logo: '/placeholder.svg', connected: false },
  { id: 'aeropay', name: 'AeroPay', description: 'ACH bank-to-bank payments for the cannabis industry.', logo: '/placeholder.svg', connected: true },
  { id: 'canpay', name: 'CanPay', description: 'The leading debit payment app for cannabis retailers.', logo: '/placeholder.svg', connected: false },
  { id: 'plaid', name: 'Plaid', description: 'Connect customer bank accounts for ACH payments.', logo: '/placeholder.svg', connected: false },
  { id: 'cash', name: 'Cash', description: 'Accept cash payments in-store.', logo: '/placeholder.svg', connected: true },
];

export function PaymentSettings() {
    const { toast } = useToast();
    const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);

    const handleToggle = (id: string) => {
        setGateways(prev => prev.map(gw => gw.id === id ? { ...gw, connected: !gw.connected } : gw));
        const gateway = gateways.find(gw => gw.id === id);
        toast({
            title: `Gateway ${!gateway?.connected ? 'Connected' : 'Disconnected'}`,
            description: `${gateway?.name} has been ${!gateway?.connected ? 'enabled' : 'disabled'}.`,
        });
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                    <CreditCard className="mr-3 h-8 w-8" />
                    Payment Gateways
                </h1>
                <Button>
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Manage Payment Methods</CardTitle>
                    <CardDescription>Enable or disable payment gateways for your checkout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {gateways.map(gateway => (
                        <Card key={gateway.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">{gateway.name}</p>
                                    <p className="text-sm text-muted-foreground">{gateway.description}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                <div className='flex items-center gap-2 flex-1'>
                                    <Switch 
                                        checked={gateway.connected} 
                                        onCheckedChange={() => handleToggle(gateway.id)}
                                        id={`switch-${gateway.id}`}
                                    />
                                    <label htmlFor={`switch-${gateway.id}`} className={`text-sm font-medium ${gateway.connected ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {gateway.connected ? 'Connected' : 'Disconnected'}
                                    </label>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Configure</DropdownMenuItem>
                                        <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
