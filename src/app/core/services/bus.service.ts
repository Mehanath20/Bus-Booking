import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus, Seat } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusService {
    private seatsSubject = new BehaviorSubject<Map<string, Seat[]>>(new Map());
    public seats$ = this.seatsSubject.asObservable();

    constructor(private http: HttpClient) {
        // Simulate real-time seat updates every 10 seconds
        interval(10000).subscribe(() => this.simulateSeatLocking());
    }

    searchBuses(source: string, destination: string): Observable<Bus[]> {
        return this.http.get<Bus[]>(
            `${environment.apiUrl}/buses?source=${source}&destination=${destination}`
        );
    }

    getAllBuses(): Observable<Bus[]> {
        return this.http.get<Bus[]>(`${environment.apiUrl}/buses`);
    }

    getBusById(id: string): Observable<Bus> {
        return this.http.get<Bus>(`${environment.apiUrl}/buses/${id}`);
    }

    addBus(bus: Bus): Observable<Bus> {
        return this.http.post<Bus>(`${environment.apiUrl}/buses`, bus);
    }

    updateBus(id: string, bus: Partial<Bus>): Observable<Bus> {
        return this.http.patch<Bus>(`${environment.apiUrl}/buses/${id}`, bus);
    }

    deleteBus(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/buses/${id}`);
    }

    getSeats(busId: string): Seat[] {
        const currentSeats = this.seatsSubject.value;
        if (!currentSeats.has(busId)) {
            // Generate initial seat layout (40 seats: 4 columns x 10 rows)
            const seats: Seat[] = [];
            for (let i = 1; i <= 40; i++) {
                const row = Math.ceil(i / 4);
                const col = ['A', 'B', 'C', 'D'][((i - 1) % 4)];
                seats.push({
                    id: `${busId}-${i}`,
                    seatNumber: `${row}${col}`,
                    status: Math.random() > 0.7 ? 'booked' : 'available'
                });
            }
            currentSeats.set(busId, seats);
            this.seatsSubject.next(new Map(currentSeats));
        }
        return currentSeats.get(busId) || [];
    }

    lockSeat(busId: string, seatId: string, userId: string): void {
        const currentSeats = this.seatsSubject.value;
        const busSeats = currentSeats.get(busId) || [];
        const seat = busSeats.find(s => s.id === seatId);

        if (seat && seat.status === 'available') {
            seat.status = 'locked';
            seat.lockedUntil = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
            seat.lockedBy = userId;
            this.seatsSubject.next(new Map(currentSeats));

            // Auto-unlock after 2 minutes
            setTimeout(() => {
                this.unlockSeat(busId, seatId);
            }, 2 * 60 * 1000);
        }
    }

    unlockSeat(busId: string, seatId: string): void {
        const currentSeats = this.seatsSubject.value;
        const busSeats = currentSeats.get(busId) || [];
        const seat = busSeats.find(s => s.id === seatId);

        if (seat && seat.status === 'locked') {
            seat.status = 'available';
            delete seat.lockedUntil;
            delete seat.lockedBy;
            this.seatsSubject.next(new Map(currentSeats));
        }
    }

    selectSeat(busId: string, seatId: string): void {
        const currentSeats = this.seatsSubject.value;
        const busSeats = currentSeats.get(busId) || [];
        const seat = busSeats.find(s => s.id === seatId);

        if (seat && (seat.status === 'available' || seat.status === 'locked')) {
            seat.status = 'selected';
            this.seatsSubject.next(new Map(currentSeats));
        }
    }

    deselectSeat(busId: string, seatId: string): void {
        const currentSeats = this.seatsSubject.value;
        const busSeats = currentSeats.get(busId) || [];
        const seat = busSeats.find(s => s.id === seatId);

        if (seat && seat.status === 'selected') {
            seat.status = 'available';
            this.seatsSubject.next(new Map(currentSeats));
        }
    }

    private simulateSeatLocking(): void {
        const currentSeats = this.seatsSubject.value;
        currentSeats.forEach((seats, busId) => {
            const availableSeats = seats.filter(s => s.status === 'available');
            if (availableSeats.length > 0 && Math.random() > 0.8) {
                const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
                this.lockSeat(busId, randomSeat.id, 'system');
            }
        });
    }
}
