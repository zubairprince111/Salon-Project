"use client";

import { useState } from 'react';
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
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login('admin@glamora.com', password);
            router.push('/admin/dashboard');
        } catch (error) {
            toast({
                title: "Login Failed",
                description: "The password you entered is incorrect. Please try again.",
                variant: "destructive"
            });
            console.error(error);
        }
    };
    
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 flex items-center justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Admin Login</CardTitle>
                        <CardDescription>Enter the password to access the admin dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required 
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
