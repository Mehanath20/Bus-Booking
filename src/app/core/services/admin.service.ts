import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminMetrics, Booking, User, Bus } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private http: HttpClient) { }

    getMetrics(): Observable<AdminMetrics> {
        return forkJoin({
            users: this.http.get<User[]>(`${environment.apiUrl}/users`),
            bookings: this.http.get<Booking[]>(`${environment.apiUrl}/bookings`),
            buses: this.http.get<Bus[]>(`${environment.apiUrl}/buses`)
        }).pipe(
            map(({ users, bookings, buses }) => {
                const totalUsers = users.filter(u => u.role === 'customer').length;
                const totalBookings = bookings.length;

                const totalRevenue = bookings
                    .filter(b => b.status === 'confirmed' || b.status === 'completed')
                    .reduce((sum, b) => sum + b.totalAmount, 0);

                // Most popular route
                const routeCounts = new Map<string, number>();
                bookings.forEach(b => {
                    const route = `${b.source}-${b.destination}`;
                    routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
                });
                const mostPopularRoute = Array.from(routeCounts.entries())
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

                // Peak booking hour (simulate)
                const peakBookingHour = Math.floor(Math.random() * 24);

                // Seat occupancy
                const totalSeats = buses.reduce((sum, b) => sum + b.totalSeats, 0);
                const bookedSeats = buses.reduce((sum, b) => sum + (b.totalSeats - b.availableSeats), 0);
                const seatOccupancy = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

                return {
                    totalUsers,
                    totalBookings,
                    totalRevenue,
                    mostPopularRoute,
                    peakBookingHour,
                    seatOccupancy
                };
            })
        );
    }

    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${environment.apiUrl}/bookings`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }
}
