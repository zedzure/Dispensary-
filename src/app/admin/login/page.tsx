
'use client';

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { User } from "@/types/user";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    let loggedInUser: User | null = null;
    
    if (email.toLowerCase() === "k.lunaris@gmail.com" && password === "Dancer$5109") {
        loggedInUser = {
            name: "Admin User",
            email: "k.lunaris@gmail.com",
            memberSince: "2024",
            avatarUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400",
            points: 0,
            nextReward: 0,
            role: 'admin',
        };
    }
    
    if (loggedInUser) {
        login(loggedInUser);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid admin credentials.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-md shadow-lg border-border/60">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-primary">Admin Access</CardTitle>
                <CardDescription>Enter your administrator credentials below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input 
                id="email-login" 
                type="email" 
                placeholder="admin@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input 
                id="password-login" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-6">
                <Button className="w-full" onClick={handleAdminLogin}>Login</Button>
            </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
