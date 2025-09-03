
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { services } from '@/lib/services.tsx';
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addItem } = useCart();
  const { toast } = useToast();

  const service = services.find(s => s.id === id);

  if (!service) {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Service not found</h1>
                    <p className="mt-4 text-muted-foreground">The service you are looking for does not exist.</p>
                    <Button asChild className="mt-6">
                        <Link href="/">Return to Homepage</Link>
                    </Button>
                </div>
            </main>
            <Footer />
      </div>
    );
  }

  const handleAddToBooking = (service: Omit<CartItem, 'quantity'>) => {
    addItem({ ...service, quantity: 1 });
    toast({
        title: "Added to Booking",
        description: `${service.name} has been added to your booking cart.`,
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
                 <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    data-ai-hint={service.image.aiHint}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl w-full h-auto"
                />
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{service.name}</h1>
                    <p className="font-semibold text-primary text-2xl">৳{service.price.toFixed(2)}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{service.longDescription}</p>
                <div className="flex gap-4">
                     <Button size="lg" onClick={() => handleAddToBooking(service)}>
                        <PlusCircle className="mr-2 h-5 w-5"/>
                        Add to Booking
                    </Button>
                     <Button size="lg" variant="outline" asChild>
                        <Link href="/checkout">Go to Checkout</Link>
                    </Button>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
