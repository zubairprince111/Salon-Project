"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { BookingList } from "@/components/admin/booking-list";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
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
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
           <Button onClick={() => {
                const {logout} = useAuth.getInitialProps ? useAuth.getInitialProps() : {logout: () => {
                    sessionStorage.removeItem('glamora-admin');
                    window.location.reload();
                }};
                logout();
            }}>Logout</Button>
        </div>
        <BookingList />
      </main>
      <Footer />
    </div>
  );
}
