
'use client';

import { Leaf, ShoppingCart, User, ClipboardList, Shield, PanelLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { useContext } from 'react';
import { SidebarContext } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { totalItems, setCartOpen } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const sidebarContext = useContext(SidebarContext);
  const toggleSidebar = sidebarContext?.toggleSidebar;

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
            {isMobile && isAdminPage && toggleSidebar && (
                 <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                 </Button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                GreenLeaf Guide
              </span>
            </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#menu" className="text-muted-foreground hover:text-primary transition-colors">Menu</Link>
          <Link href="#why-us" className="text-muted-foreground hover:text-primary transition-colors">Why Us</Link>
          <Link href="#recommender" className="text-muted-foreground hover:text-primary transition-colors">Recommender</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          {user?.role !== 'budtender' && user?.role !== 'admin' && (
            <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{totalItems}</Badge>
              )}
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          )}

          {user ? (
            user.role === 'budtender' ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/budtender">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : user.role === 'admin' ? (
              <Button asChild variant="destructive" size="sm">
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
              </Button>
            )
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
