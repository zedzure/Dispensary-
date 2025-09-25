
'use client';

import { Leaf, ShoppingCart, User, ClipboardList, Shield, PanelLeft, Sun, Moon, ChevronDown, Zap, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function Header() {
  const { totalItems, setCartOpen } = useCart();
  const { user } = useAuth();
  const { setTheme, theme } = useTheme();

  const navItems = [
    { href: "/", label: "Marketplace" },
    { href: "/#menu", label: "Menu" },
    { href: "/#new", label: "New" },
    { href: "/about", label: "About" },
    { href: "/#recommender", label: "Recommender" },
    { href: "/notes", label: "Notes" },
  ];

  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                GreenLeaf Guide
              </span>
            </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Menu <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {navItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
            {totalItems > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{totalItems}</Badge>
            )}
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          {user ? (
              <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
              </Button>
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
