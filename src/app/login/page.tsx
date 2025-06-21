'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { BottomNavBar } from "@/components/bottom-nav-bar";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c1.93 0 3.38.79 4.38 1.73l2.63-2.62C18.07.83 15.52 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.94 0 12.06-4.82 12.06-12.42 0-.8-.08-1.55-.2-2.3H12.48z" fill="currentColor" />
    </svg>
);


export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
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
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="jane@example.com" required />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                    <Label htmlFor="password-login">Password</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input id="password-login" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button className="w-full">Login</Button>
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
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join GreenLeaf Guide to start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <Input id="name-signup" placeholder="Jane Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="jane@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" required />
                </div>
                 <p className="text-xs text-muted-foreground pt-2">
                    By creating an account, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button className="w-full">Create Account</Button>
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
