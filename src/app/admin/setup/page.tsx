
"use client";

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminSetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { toast } = useToast();

    const handleCreateAdmin = async () => {
        setIsLoading(true);
        setResult(null);
        setErrorMessage('');

        try {
            const auth = getAuth(app);
            await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'adminpassword');
            setResult('success');
             toast({
                title: "Admin User Created",
                description: "You can now log in with the default credentials.",
            });
        } catch (error: any) {
            setResult('error');
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('The admin user already exists. You can proceed to login.');
            } else {
                setErrorMessage(error.message);
            }
             toast({
                title: "Setup Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 flex items-center justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Admin Setup</CardTitle>
                        <CardDescription>
                            This is a one-time setup to create your admin account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <p className="text-muted-foreground">
                            Click the button below to create the initial admin user with the credentials:
                        </p>
                        <div className="text-left w-fit mx-auto bg-muted p-4 rounded-md">
                            <p><strong>Email:</strong> admin@glamora.com</p>
                            <p><strong>Password:</strong> adminpassword</p>
                        </div>
                        
                        <Button 
                            onClick={handleCreateAdmin} 
                            disabled={isLoading || result === 'success'}
                            className="w-full"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating Admin...' : 'Create Admin User'}
                        </Button>

                        {result === 'success' && (
                            <div className="text-green-600 flex items-center justify-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <p>Admin user created successfully! You may now log in.</p>
                            </div>
                        )}
                        {result === 'error' && (
                             <div className="text-destructive flex items-center justify-center gap-2">
                                <XCircle className="h-5 w-5" />
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        
                        <Button variant="link" asChild>
                            <Link href="/admin/login">Go to Login Page</Link>
                        </Button>

                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
