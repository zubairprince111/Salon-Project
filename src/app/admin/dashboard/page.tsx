"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { BookingList } from "@/components/admin/booking-list";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-24 flex items-center justify-center">
                <div className="text-center flex items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading Dashboard...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
           <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
                <BookingList />
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
