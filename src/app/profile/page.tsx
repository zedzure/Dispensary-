
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Edit, Gift, LogOut, MapPin, Settings, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const placeholderImage = 'https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=600';
const placeholderHint = 'cannabis product';

const orders = [
  { id: "#G12345", date: "2024-07-20", total: 75.50, status: "Completed", items: [{ name: "OG Kush", quantity: 1, price: 45.00, image: placeholderImage, hint: placeholderHint }, { name: "Pre-roll Pack", quantity: 1, price: 30.50, image: placeholderImage, hint: placeholderHint }] },
  { id: "#G12344", date: "2024-07-15", total: 50.00, status: "Delivered", items: [{ name: "Blue Dream Vape", quantity: 2, price: 25.00, image: placeholderImage, hint: placeholderHint }] },
  { id: "#G12342", date: "2024-07-01", total: 120.00, status: "Delivered", items: [{ name: "Edibles Mix", quantity: 3, price: 40.00, image: placeholderImage, hint: placeholderHint }] },
];

const paymentMethods = [
    { type: "Visa", last4: "4242", expiry: "12/26" },
    { type: "Mastercard", last4: "5555", expiry: "08/25" },
];

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  const progressPercentage = (user.points / user.nextReward) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg border-border/60">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-2">Member since {user.memberSince}</p>
                <Button variant="outline" size="sm" className="mt-4">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Loyalty Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                    <p className="text-4xl font-bold text-primary">🌿 {user.points.toLocaleString()}</p>
                    <p className="text-muted-foreground">Points</p>
                </div>
                <Progress value={progressPercentage > 0 ? Math.max(1, progressPercentage) : 0} className="mt-4 h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                    {user.nextReward - user.points} points away from your next reward!
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-border/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start"><ShoppingBag className="mr-2"/> Start New Order</Button>
                    <Button variant="ghost" className="w-full justify-start"><MapPin className="mr-2"/> Manage Locations</Button>
                </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Order History
                </CardTitle>
                <CardDescription>View your past purchases and track current orders.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* Mobile View: List of Cards */}
                <div className="space-y-4 md:hidden">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-border/60 overflow-hidden">
                       <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/30">
                          <div>
                            <CardTitle className="text-base font-semibold">{order.id}</CardTitle>
                            <CardDescription className="text-xs">{order.date}</CardDescription>
                          </div>
                          <Badge variant={order.status === 'Completed' || order.status === 'Delivered' ? 'default' : 'secondary'} className="capitalize shrink-0">{order.status}</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y divide-border">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-4">
                                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" data-ai-hint={item.hint} />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30 flex justify-end items-center gap-4">
                          <span className="text-sm text-muted-foreground">Total</span>
                          <span className="font-bold text-base">${order.total.toFixed(2)}</span>
                        </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[55%]">Order Details</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                  <Image src={order.items[0].image} alt={order.items[0].name} width={40} height={40} className="rounded-md" data-ai-hint={order.items[0].hint}/>
                                  <div>
                                      <p className="font-semibold">{order.id}</p>
                                      <p className="text-xs text-muted-foreground truncate">{order.items.map(item => item.name).join(', ')}</p>
                                  </div>
                              </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                              <Badge variant={order.status === 'Completed' || order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Digital Wallet
                </CardTitle>
                <CardDescription>Manage your saved payment methods for faster checkout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4 bg-background">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-2 rounded-md">
                                <CreditCard className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold">{method.type} ending in {method.last4}</p>
                                <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add New Payment Method</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
