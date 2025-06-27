
"use client";

import React from 'react';
import { Link2, Save, TestTube2, RotateCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export function ComplianceSettings() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your compliance and integration settings have been updated.",
        });
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
                <Link2 className="mr-3 h-8 w-8" />
                Compliance & Integrations
                </h1>
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>METRC Integration</CardTitle>
                        <CardDescription>Connect to your state's METRC system for automated compliance reporting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="metrc-key">User API Key</Label>
                            <Input id="metrc-key" type="password" placeholder="Enter your METRC API key" defaultValue="abcdef1234567890" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metrc-license">Dispensary License Number</Label>
                            <Input id="metrc-license" placeholder="e.g., C10-0000123-LIC" defaultValue="C10-0000123-LIC"/>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="metrc-enabled" defaultChecked />
                            <Label htmlFor="metrc-enabled">Enable METRC Integration</Label>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline"><TestTube2 className="mr-2 h-4 w-4" />Test Connection</Button>
                            <Button><RotateCw className="mr-2 h-4 w-4" />Run Manual Sync</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>BioTrackTHC Integration</CardTitle>
                        <CardDescription>Connect to your BioTrackTHC system for an alternative compliance pathway.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="biotrack-username">API Username</Label>
                            <Input id="biotrack-username" placeholder="Enter your BioTrack API Username" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="biotrack-key">API Key</Label>
                            <Input id="biotrack-key" type="password" placeholder="Enter your BioTrack API key" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="biotrack-enabled" />
                            <Label htmlFor="biotrack-enabled">Enable BioTrack Integration</Label>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" disabled><TestTube2 className="mr-2 h-4 w-4" />Test Connection</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Reporting Settings</CardTitle>
                    <CardDescription>Configure how and when compliance reports are generated.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Automated Daily Reporting</p>
                            <p className="text-sm text-muted-foreground">Automatically submit sales and inventory data daily at midnight.</p>
                        </div>
                        <Switch defaultChecked/>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Low Stock Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive a notification if METRC-tracked inventory is low.</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
