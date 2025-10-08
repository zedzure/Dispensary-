'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="space-y-4">
          <SearchX className="mx-auto h-24 w-24 text-destructive" />
          <h1 className="text-4xl md:text-6xl font-bold font-cursive text-primary">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild size="lg" className="text-foreground">
            <Link href="/">
              Go Back Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
