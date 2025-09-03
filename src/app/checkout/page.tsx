
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Trash2, CreditCard, Smartphone, Store, Loader2, CalendarIcon } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { app } from '@/lib/firebase';
import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from "firebase/firestore";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';


const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Invalid phone number."),
  bookingDate: z.date({
    required_error: "An appointment date is required.",
  }),
  bookingTime: z.string({
      required_error: "An appointment time is required."
  }),
  paymentMethod: z.enum(['salon', 'card', 'wallet'], {
    required_error: "You need to select a payment method."
  }),
  // Demo fields - no real validation needed
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  walletNumber: z.string().optional(),
  walletPin: z.string().optional(),
});

const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function CheckoutPage() {
  const { toast } = useToast();
  const { items, removeItem, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      paymentMethod: "salon",
      bookingTime: "",
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsLoading(true);
    if (items.length === 0) {
        toast({
            title: "Your cart is empty",
            description: "Please add a service to your booking before checking out.",
            variant: "destructive"
        });
        setIsLoading(false);
        return;
    }
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        const db = getFirestore(app);
        const batch = writeBatch(db);
        const now = serverTimestamp();
        
        const bookingIds: string[] = [];

        const appointmentTimestamp = new Date(values.bookingDate);
        const [time, period] = values.bookingTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        appointmentTimestamp.setHours(hours, minutes, 0, 0);

        // Create a booking document for each item in the cart
        items.forEach(item => {
            const bookingRef = doc(collection(db, "bookings"));
            batch.set(bookingRef, {
                userId: values.email, // Using email as userId as there are no customer accounts
                servicename: item.name,
                timeslot: appointmentTimestamp,
                status: 'pending',
                bookedat: now
            });
            bookingIds.push(bookingRef.id);
        });

        // Create a single payment document for the entire transaction
        const paymentRef = doc(collection(db, 'payments'));
        batch.set(paymentRef, {
            bookingid: bookingIds.join(','), // Storing all related booking IDs
            userid: values.email,
            amount: total,
            currency: 'BDT', // Assuming BDT as currency
            paymentmethod: values.paymentMethod,
            transactionid: `demo_${Date.now()}`,
            status: values.paymentMethod === 'salon' ? 'pending' : 'paid',
            paidat: now
        });

        await batch.commit();

        toast({
            title: "Booking Confirmed!",
            description: `Your appointment is set for ${format(values.bookingDate, "PPP")} at ${values.bookingTime}.`,
        });
        
        clearCart();
        form.reset();
    } catch (error) {
        console.error("Error creating booking: ", error);
        toast({
            title: "Booking Failed",
            description: "There was an error submitting your booking. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  const renderPaymentForm = () => {
    switch(paymentMethod) {
        case 'card':
            return (
                <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><CreditCard/> Enter Card Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9101 1121" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiry</Label>
                                <Input id="cardExpiry" placeholder="MM/YY" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cardCvc">CVC</Label>
                                <Input id="cardCvc" placeholder="123" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        case 'wallet':
            return (
                 <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Smartphone/> Enter Mobile Wallet Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="walletNumber">Wallet Number</Label>
                            <Input id="walletNumber" placeholder="e.g., 01234567890" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletPin">PIN</Label>
                            <Input id="walletPin" type="password" placeholder="••••" />
                        </div>
                    </CardContent>
                </Card>
            )
        default:
            return (
                 <Card className="mt-6 bg-muted/50">
                     <CardContent className="p-6">
                        <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                            <Store className="h-4 w-4"/> You will pay at the salon upon your visit.
                        </p>
                     </CardContent>
                 </Card>
            );
    }
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
        
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div className="order-2 lg:order-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>1. Your Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>2. Appointment Time</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="bookingDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0,0,0,0))
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bookingTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Slot</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                                                >
                                                    {timeSlots.map(time => (
                                                        <FormItem key={time}>
                                                          <FormControl>
                                                              <RadioGroupItem value={time} id={time} className="sr-only"/>
                                                          </FormControl>
                                                          <Label htmlFor={time} className={cn("flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm", field.value === time && "border-primary")}>
                                                              {time}
                                                          </Label>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>3. Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid md:grid-cols-3 gap-4"
                                                >
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="salon" id="salon" className="sr-only"/>
                                                        </FormControl>
                                                        <Label htmlFor="salon" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'salon' && "border-primary")}>
                                                            <Store className="mb-3 h-6 w-6" />
                                                            Pay at Salon
                                                        </Label>
                                                    </FormItem>
                                                     <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="card" id="card" className="sr-only"/>
                                                        </FormControl>
                                                        <Label htmlFor="card" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'card' && "border-primary")}>
                                                            <CreditCard className="mb-3 h-6 w-6" />
                                                            Credit Card
                                                        </Label>
                                                    </FormItem>
                                                     <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="wallet" id="wallet" className="sr-only"/>
                                                        </FormControl>
                                                        <Label htmlFor="wallet" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'wallet' && "border-primary")}>
                                                            <Smartphone className="mb-3 h-6 w-6" />
                                                            Mobile Wallet
                                                        </Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {renderPaymentForm()}
                            </CardContent>
                        </Card>

                        <Button type="submit" size="lg" className="w-full" disabled={items.length === 0 || isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Confirming Booking...' : (paymentMethod === 'salon' ? 'Confirm & Book Now' : 'Pay & Book Now')}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="order-1 lg:order-2">
                <Card className="shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle>Your Booking Summary</CardTitle>
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
                                            <span className="sr-only">Remove {item.name}</span>
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

    