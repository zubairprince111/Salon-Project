
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';


export default function AdminLoginPage() {
    const [email, setEmail] = useState('admin@glamora.com');
    const [password, setPassword] = useState('adminpassword');
    const { login, loading, user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If the user is already logged in, redirect them to the dashboard.
        if (!loading && user) {
            router.push('/admin/dashboard');
        }
    }, [user, loading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!email || !password) {
             toast({
                title: "Login Failed",
                description: "Please enter both email and password.",
                variant: "destructive"
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await login(email, password);
            // On successful login, the useEffect above will trigger the redirect.
        } catch (error: any) {
            console.error("Login Error:", error.message);
            toast({
                title: "Login Failed",
                description: "The email or password you entered is incorrect. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // While checking auth state, show a generic loading screen.
    if (loading) {
        return (
             <div className="flex flex-col min-h-dvh bg-background text-foreground">
                <Header />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-24 flex items-center justify-center">
                    <div className="text-center flex items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Initializing...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
    
    // If user exists, we are in the process of redirecting.
    if (user) {
         return (
             <div className="flex flex-col min-h-dvh bg-background text-foreground">
                <Header />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-24 flex items-center justify-center">
                    <div className="text-center flex items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Redirecting to Dashboard...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // Otherwise, show the login form.
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 flex items-center justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Admin Login</CardTitle>
                        <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@glamora.com"
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? 'Logging In...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
