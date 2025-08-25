
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Invalid phone number."),
});

export default function CheckoutPage() {
  const { toast } = useToast();
  const { items, removeItem, clearCart } = useCart();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Form values:", values);
    console.log("Cart items:", items);
    
    toast({
        title: "Booking Confirmed!",
        description: "Thank you for your booking. We will contact you shortly.",
    });
    
    clearCart();
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Review your booking and confirm your appointment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Your Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                               <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                               <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                               <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="(123) 456-7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" size="lg" className="w-full" disabled={items.length === 0}>
                                    Confirm & Book Now
                              </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            Payment will be processed at the salon.
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <div className="order-1 md:order-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Your Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {items.length === 0 ? (
                            <p className="text-muted-foreground">Your booking cart is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">৳{item.price.toFixed(2)}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>৳{total.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
