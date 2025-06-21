import { Leaf, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">
            GreenLeaf Guide
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#menu" className="text-muted-foreground hover:text-primary transition-colors">Menu</Link>
          <Link href="#why-us" className="text-muted-foreground hover:text-primary transition-colors">Why Us</Link>
          <Link href="#recommender" className="text-muted-foreground hover:text-primary transition-colors">Recommender</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
