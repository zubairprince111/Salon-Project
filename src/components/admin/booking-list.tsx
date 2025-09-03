
"use client";

import { useState, useEffect } from 'react';
import { app } from '@/lib/firebase';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
    id: string;
    userId: string;
    servicename: string;
    timeslot: Timestamp;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    bookedat: Timestamp;
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
                const q = query(bookingsCollection, orderBy('bookedat', 'desc'));
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
                    <TableHead>Appointment</TableHead>
                    <TableHead>Customer (User ID)</TableHead>
                    <TableHead>Service</TableHead>
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

    