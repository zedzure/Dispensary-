
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Plus, Minus, User, ShoppingCart, DollarSign, Leaf } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { allProductsFlat } from '@/lib/products';
import { mockCustomers } from '@/lib/mockCustomers';
import type { Product } from '@/types/product';
import type { UserProfile, CartItem } from '@/types/pos';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';

// In a real app, customers would be fetched from a database.
const customers: UserProfile[] = mockCustomers;

// POS Main Component
export default function BudtenderPOSPage() {
    const { user, isUserLoading: loading } = useUser();
    const auth = useAuth();
    const db = useFirestore();
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    // State Management
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCustomer, setActiveCustomer] = useState<UserProfile | null>(null);

    useEffect(() => {
        setIsClient(true);
        if (customers.length > 0) {
            setActiveCustomer(customers[0]);
        }
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            }
        };
        fetchUserRole();
    }, [user, db]);

    // Derived State
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return allProductsFlat.slice(0, 50); // Limit initial display
        return allProductsFlat.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0), [cart]);
    const tax = subtotal * 0.15; // Mock 15% tax
    const total = subtotal + tax;

    // Handlers
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prevCart => {
            const item = prevCart.find(i => i.id === productId);
            if (item && item.quantity + delta <= 0) {
                return prevCart.filter(i => i.id !== productId);
            }
            return prevCart.map(i => i.id === productId ? { ...i, quantity: i.quantity + delta } : i);
        });
    };

    const clearCart = () => setCart([]);

    const handleCheckout = () => {
        if (!isClient) return;
        if (cart.length === 0) {
            toast({ title: 'Cart is empty', description: 'Add products to the cart before checkout.', variant: 'destructive' });
            return;
        }
        if (!activeCustomer) {
            toast({ title: 'No Customer Selected', description: 'Please select a customer before checking out.', variant: 'destructive' });
            return;
        }

        try {
            const newOrder = {
                id: `ORD-POS-${Date.now()}`,
                customerName: `${activeCustomer.firstName} ${activeCustomer.lastName}`,
                customerId: activeCustomer.id,
                orderDate: new Date().toISOString(),
                itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
                items: cart,
                totalAmount: total,
                status: 'Pending Checkout' as const,
                submittedByPOS: true,
            };
            
            const pendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
            let pendingOrders = pendingOrdersRaw ? JSON.parse(pendingOrdersRaw) : [];
            
            pendingOrders.push(newOrder);
            localStorage.setItem(POS_PENDING_ORDERS_STORAGE_KEY, JSON.stringify(pendingOrders));

            toast({ 
                title: 'Order Submitted to Queue', 
                description: `Order for ${activeCustomer.firstName} sent for processing. Total: $${total.toFixed(2)}` 
            });
            clearCart();
        } catch(e) {
            console.error("Failed to save pending order:", e);
            toast({ title: 'Error', description: 'Could not submit order to queue. Check console for details.', variant: 'destructive' });
        }
    };
    
    useEffect(() => {
        if (!loading && (!user || userRole && userRole !== 'budtender')) {
            router.replace('/login');
        }
    }, [user, userRole, loading, router]);
    
    if (loading || !isClient || !userRole) {
        return (
          <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
                <div className="flex flex-col items-center gap-4">
                    <Leaf className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading POS...</p>
                </div>
            </main>
            <Footer />
          </div>
        );
    }
    
    if (!user || userRole !== 'budtender') {
        return (
             <div className="flex flex-col min-h-screen bg-muted/40">
                <Header />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                   <p>Redirecting to login...</p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 h-full">
                    
                    {/* Right Column (Cart & Customer) - Appears on top on mobile */}
                    <div className="lg:order-2 bg-background/60 backdrop-blur-sm rounded-lg shadow-md flex flex-col h-[calc(100vh-18rem)] sm:h-[calc(100vh-15rem)] lg:h-[calc(100vh-12rem)]">
                        <div className="p-4 border-b">
                            {activeCustomer ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-primary">
                                        <AvatarImage src={activeCustomer.avatarUrl} alt={activeCustomer.firstName} data-ai-hint={activeCustomer.dataAiHint} />
                                        <AvatarFallback>{activeCustomer.firstName[0]}{activeCustomer.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{activeCustomer.firstName} {activeCustomer.lastName}</p>
                                        <p className="text-xs text-muted-foreground">Member Since: {new Date(activeCustomer.memberSince).toLocaleDateString()}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setActiveCustomer(null)}><X className="h-4 w-4" /></Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Input placeholder="Search Customer..." className="h-10" />
                                    <Button><User className="mr-2 h-5 w-5"/>Add New Customer</Button>
                                </div>
                            )}
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-3">
                                {cart.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <ShoppingCart className="mx-auto h-10 w-10 mb-2"/>
                                        <p>Cart is empty</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill style={{objectFit:'cover'}} data-ai-hint={item.hint} />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">${item.price?.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-4 w-4"/></Button>
                                                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-4 w-4"/></Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                        
                        {cart.length > 0 && (
                            <div className="p-4 border-t mt-auto space-y-3 bg-background/80 rounded-b-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (15%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <Button className="w-full h-12 text-lg" size="lg" onClick={handleCheckout} disabled={cart.length === 0 || !activeCustomer}>
                                    <DollarSign className="mr-2 h-5 w-5" /> Charge ${total.toFixed(2)}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Left Column (Product Grid) - Appears below on mobile */}
                    <div className="lg:order-1 lg:col-span-2 bg-background/60 backdrop-blur-sm rounded-lg shadow-md flex flex-col h-[calc(100vh-18rem)] sm:h-[calc(100vh-15rem)] lg:h-[calc(100vh-12rem)] mt-4 lg:mt-0">
                        <div className="p-4 border-b">
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-10 h-10 text-base"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                                {filteredProducts.map(product => (
                                    <Card 
                                        key={product.id} 
                                        className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group bg-card/60 backdrop-blur-sm"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="relative aspect-square">
                                            <Image src={product.image} alt={product.name} fill style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform" data-ai-hint={product.hint} />
                                        </div>
                                        <div className="p-2 sm:p-3">
                                            <p className="font-semibold text-sm truncate">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.category}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                </div>
            </main>
        </div>
    );
}

    