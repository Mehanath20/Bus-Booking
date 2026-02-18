import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bus, Booking, User } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl; // http://localhost:3000

    constructor(private http: HttpClient) { }

    // Bus Methods
    getBuses(): Observable<Bus[]> {
        return this.http.get<Bus[]>(`${this.apiUrl}/buses`);
    }

    getBusById(id: string): Observable<Bus> {
        return this.http.get<Bus>(`${this.apiUrl}/buses/${id}`);
    }

    addBus(bus: Bus): Observable<Bus> {
        return this.http.post<Bus>(`${this.apiUrl}/buses`, bus);
    }

    updateBus(id: string, bus: Partial<Bus>): Observable<Bus> {
        return this.http.patch<Bus>(`${this.apiUrl}/buses/${id}`, bus);
    }

    deleteBus(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/buses/${id}`);
    }

    // Booking Methods
    getBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
    }

    getUserBookings(userId: string): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/bookings?userId=${userId}`);
    }

    addBooking(booking: Booking): Observable<Booking> {
        return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
    }

    // User Methods
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    getUserByEmail(email: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`);
    }

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, user);
    }
}
