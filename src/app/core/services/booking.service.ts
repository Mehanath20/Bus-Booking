import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, Payment } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    constructor(private http: HttpClient) { }

    createBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
        const newBooking = {
            ...booking,
            bookingDate: new Date().toISOString(),
            status: 'confirmed' as const
        };
        return this.http.post<Booking>(`${environment.apiUrl}/bookings`, newBooking);
    }

    getUserBookings(userId: string): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${environment.apiUrl}/bookings?userId=${userId}`);
    }

    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${environment.apiUrl}/bookings`);
    }

    getBookingById(id: string): Observable<Booking> {
        return this.http.get<Booking>(`${environment.apiUrl}/bookings/${id}`);
    }

    cancelBooking(id: string): Observable<Booking> {
        return this.http.patch<Booking>(`${environment.apiUrl}/bookings/${id}`, { status: 'cancelled' });
    }

    createPayment(payment: Omit<Payment, 'id' | 'timestamp'>): Observable<Payment> {
        const newPayment = {
            ...payment,
            timestamp: new Date().toISOString()
        };
        return this.http.post<Payment>(`${environment.apiUrl}/payments`, newPayment);
    }

    getPaymentHistory(bookingId: string): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${environment.apiUrl}/payments?bookingId=${bookingId}`);
    }

    getAllPayments(): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${environment.apiUrl}/payments`);
    }
}
