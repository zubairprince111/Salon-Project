
"use client";

import { useState, useEffect } from 'react';
import { app } from '@/lib/firebase';
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, Store } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
    id: string;
    userId: string;
    servicename: string;
    timeslot: Timestamp;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    bookedat: Timestamp;
    paymentMethod?: string; // Optional field
}

interface Payment {
    bookingid: string;
    paymentmethod: string;
}

export function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookingsAndPayments = async () => {
            try {
                const db = getFirestore(app);
                
                // Fetch all bookings
                const bookingsCollection = collection(db, 'bookings');
                const bookingSnapshot = await getDocs(bookingsCollection);
                const bookingsList = bookingSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Omit<Booking, 'paymentMethod'>[];

                // Fetch all payments
                const paymentsCollection = collection(db, 'payments');
                const paymentSnapshot = await getDocs(paymentsCollection);
                const paymentsList = paymentSnapshot.docs.map(doc => doc.data() as Payment);
                
                // Create a map of bookingId to paymentMethod for easy lookup
                const paymentMethodMap = new Map<string, string>();
                paymentsList.forEach(payment => {
                    paymentMethodMap.set(payment.bookingid, payment.paymentmethod);
                });

                // Combine booking with payment method
                const combinedBookings = bookingsList.map(booking => ({
                    ...booking,
                    paymentMethod: paymentMethodMap.get(booking.id) || 'N/A'
                })).sort((a, b) => b.bookedat.toMillis() - a.bookedat.toMillis());


                setBookings(combinedBookings);

            } catch (e) {
                console.error("Error fetching data: ", e);
                setError("Failed to load bookings or payments.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingsAndPayments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-destructive text-center">{error}</p>;
    }
    
    if (bookings.length === 0) {
        return <p className="text-muted-foreground text-center py-10">No bookings have been made yet.</p>;
    }
    
    const PaymentMethodIcon = ({method}: {method?: string}) => {
        switch(method) {
            case 'card': return <CreditCard className="inline mr-2 h-4 w-4" />;
            case 'wallet': return <Smartphone className="inline mr-2 h-4 w-4" />;
            case 'salon': return <Store className="inline mr-2 h-4 w-4" />;
            default: return null;
        }
    }


    return (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Customer (User ID)</TableHead>
                    <TableHead>Service(s)</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Booked At</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                           {booking.timeslot ? (
                                <>
                                    <div>{format(booking.timeslot.toDate(), 'PPP')}</div>
                                    <div className="text-sm text-muted-foreground">{format(booking.timeslot.toDate(), 'p')}</div>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{booking.userId}</div>
                        </TableCell>
                        <TableCell>
                            {booking.servicename}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center capitalize">
                                <PaymentMethodIcon method={booking.paymentMethod} />
                                {booking.paymentMethod}
                            </div>
                         </TableCell>
                         <TableCell>
                             {booking.bookedat ? format(booking.bookedat.toDate(), 'PPP p') : 'N/A'}
                         </TableCell>
                        <TableCell className="text-center">
                            <Badge variant={
                                booking.status === 'completed' ? 'default' : 
                                booking.status === 'confirmed' ? 'secondary' :
                                booking.status === 'pending' ? 'outline' : 'destructive'
                            } className="capitalize">
                                {booking.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
