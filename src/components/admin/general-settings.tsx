
"use client";

import React from 'react';
import { Settings, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

export function GeneralSettings() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your dispensary settings have been updated.",
        });
    };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          General Settings
        </h1>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-5 w-5" /> Save All Changes
        </Button>
      </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Dispensary Information</CardTitle>
                <CardDescription>Manage the core details of your business. This information may be public.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="dispensary-name">Dispensary Name</Label>
                        <Input id="dispensary-name" placeholder="e.g., GreenLeaf Guide" defaultValue="GreenLeaf Guide" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-license">State License Number</Label>
                        <Input id="dispensary-license" placeholder="e.g., C10-0000123-LIC" defaultValue="C10-0000123-LIC" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dispensary-address">Street Address</Label>
                    <Input id="dispensary-address" placeholder="e.g., 420 S. Main St" defaultValue="420 S. Main St" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-city">City</Label>
                        <Input id="dispensary-city" placeholder="e.g., Denver" defaultValue="Denver" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-state">State</Label>
                        <Input id="dispensary-state" placeholder="e.g., CO" defaultValue="CO" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-zip">ZIP Code</Label>
                        <Input id="dispensary-zip" placeholder="e.g., 80202" defaultValue="80202" />
                    </div>
                </div>
                 <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-phone">Public Phone Number</Label>
                        <Input id="dispensary-phone" type="tel" placeholder="e.g., (555) 123-4567" defaultValue="(720) 555-0182" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dispensary-email">Public Email</Label>
                        <Input id="dispensary-email" type="email" placeholder="e.g., contact@greenleaf.com" defaultValue="contact@greenleafguide.com"/>
                    </div>
                </div>
                 <Separator />
                 <div className="space-y-2">
                    <Label>Store Logo</Label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">Logo</span>
                        </div>
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Upload New Logo</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 256x256px. PNG or JPG format.</p>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
