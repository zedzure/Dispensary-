
'use client';

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { User } from "@/types/user";

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-2">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.136,44,30.021,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const handleLogin = () => {
    let loggedInUser: User | null = null;
    
    if (loginEmail.toLowerCase() === "budtenderone@gmsil.com" && loginPassword === "Dancer$5109") {
        loggedInUser = {
            name: "Budtender One",
            email: "budtenderone@gmsil.com",
            memberSince: "2024",
            avatarUrl: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400",
            points: 0,
            nextReward: 0,
            role: 'budtender',
        };
    } else if (loginEmail === "kim.l@silzeypos.com" && loginPassword === "Dancer$5109") {
        loggedInUser = {
            name: "Kim L.",
            email: "kim.l@silzeypos.com",
            memberSince: "2024",
            avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            points: 2500,
            nextReward: 3000,
            role: 'customer',
        };
    }
    
    if (loggedInUser) {
        login(loggedInUser);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
    }
  };

  const handleSignUp = () => {
    if (!signUpName || !signUpEmail || !signUpPassword) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Please fill out all fields.",
      });
      return;
    }

    const newUser: User = {
      name: signUpName,
      email: signUpEmail,
      memberSince: new Date().getFullYear().toString(),
      avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      points: 0,
      nextReward: 1000,
      role: 'customer',
    };
    login(newUser);
    toast({
      title: "Account Created!",
      description: `Welcome to GreenLeaf Guide, ${signUpName}!`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8 pb-24 md:pb-8">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="text-center">
                <CardTitle className="text-primary">Welcome Back!</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input 
                    id="email-login" 
                    type="email" 
                    placeholder="jane@example.com" 
                    required 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                    <Label htmlFor="password-login">Password</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input 
                    id="password-login" 
                    type="password" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button className="w-full" onClick={handleLogin}>Login</Button>
                 <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or login with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <GoogleIcon />
                  Login with Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="text-center">
                <CardTitle className="text-primary">Create an Account</CardTitle>
                <CardDescription>Join GreenLeaf Guide to start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <Input id="name-signup" placeholder="Jane Doe" required value={signUpName} onChange={(e) => setSignUpName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="jane@example.com" required value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" required value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignUp()} />
                </div>
                 <p className="text-xs text-muted-foreground pt-2">
                    By creating an account, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button className="w-full" onClick={handleSignUp}>Create Account</Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                       Or sign up with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                   <GoogleIcon />
                  Sign up with Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
