
"use client";

import { useState, useEffect } from 'react';
import { app } from '@/lib/firebase';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, Store } from 'lucide-react';
import { format } from 'date-fns';

interface BookingItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    items: BookingItem[];
    total: number;
    createdAt: Timestamp;
    bookingDate: Timestamp;
    bookingTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentMethod: 'salon' | 'card' | 'wallet';
}

const PaymentMethodDisplay = ({ method }: { method: Booking['paymentMethod']}) => {
    switch(method) {
        case 'card':
            return <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4"/> Credit Card</span>;
        case 'wallet':
            return <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4"/> Mobile Wallet</span>;
        case 'salon':
        default:
            return <span className="flex items-center gap-1.5"><Store className="h-4 w-4"/> At Salon</span>;
    }
}

export function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const db = getFirestore(app);
                const bookingsCollection = collection(db, 'bookings');
                const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
                const bookingSnapshot = await getDocs(q);
                const bookingsList = bookingSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Booking[];
                setBookings(bookingsList);
            } catch (e) {
                console.error("Error fetching bookings: ", e);
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
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

    return (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Appointment</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                     <TableHead className="text-center">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                           {booking.bookingDate ? (
                                <>
                                    <div>{format(booking.bookingDate.toDate(), 'PPP')}</div>
                                    <div className="text-sm text-muted-foreground">{booking.bookingTime}</div>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{booking.name}</div>
                            <div className="text-sm text-muted-foreground">{booking.email}</div>
                            <div className="text-sm text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>
                            {booking.items.map(item => item.name).join(', ')}
                        </TableCell>
                        <TableCell>
                           <PaymentMethodDisplay method={booking.paymentMethod} />
                        </TableCell>
                        <TableCell className="text-right">৳{booking.total.toFixed(2)}</TableCell>
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

    