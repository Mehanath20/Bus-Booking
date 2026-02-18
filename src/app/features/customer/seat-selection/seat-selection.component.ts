import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from '../../../core/services/bus.service';
import { AuthService } from '../../../core/services/auth.service';
import { Seat } from '../../../core/models/models';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-seat-selection',
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-10">
      <div class="mb-8">
        <button 
          (click)="goBack()"
          class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 mb-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Search
        </button>
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Select Your Seats</h1>
        <p class="text-slate-600 dark:text-slate-300">Choose your preferred seats for the journey</p>
      </div>

      <!-- Legend -->
      <div class="card mb-6">
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-green-500 rounded border-2 border-green-700"></div>
            <span class="text-sm">Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-blue-500 rounded border-2 border-blue-700"></div>
            <span class="text-sm">Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gray-400 rounded border-2 border-gray-600"></div>
            <span class="text-sm">Booked</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-yellow-500 rounded border-2 border-yellow-700"></div>
            <span class="text-sm">Locked</span>
          </div>
        </div>
      </div>

      <!-- Locked Seat Timer -->
      @if (selectedSeats.length > 0 && timeRemaining > 0) {
        <div class="card-glass mb-6 p-4 border-2 border-yellow-400">
          <div class="flex items-center gap-4">
            <svg class="w-8 h-8 text-yellow-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <p class="text-white font-semibold">Seats locked for you!</p>
              <p class="text-white/80 text-sm">Complete booking within: {{ formatTime(timeRemaining) }}</p>
            </div>
          </div>
        </div>
      }

      <!-- Seat Grid -->
      <div class="card mb-6">
        <div class="flex justify-center">
          <div class="inline-block">
            <!-- Driver Section -->
            <div class="mb-6 flex justify-end">
              <div class="w-16 h-16 bg-slate-700 dark:bg-slate-800 rounded flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Seats -->
            <div class="grid grid-cols-4 gap-4">
              @for (seat of seats; track seat.id) {
                <button
                  (click)="toggleSeat(seat)"
                  [disabled]="seat.status === 'booked' || (seat.status === 'locked' && seat.lockedBy !== userId)"
                  [class]="getSeatClass(seat)"
                  class="w-16 h-16 rounded border-2 font-semibold text-sm transition-all disabled:cursor-not-allowed hover:scale-110">
                  {{ seat.seatNumber }}
                  @if (seat.status === 'locked' && seat.lockedUntil) {
                    <div class="text-xs">{{ getRemainingTime(seat.lockedUntil) }}s</div>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="card">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Selected Seats</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ getSelectedSeatNumbers() }}
            </p>
          </div>
          <button 
            (click)="proceedToPayment()"
            [disabled]="selectedSeats.length === 0"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            Proceed to Payment ({{ selectedSeats.length }} seats)
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SeatSelectionComponent implements OnInit, OnDestroy {
  busId = '';
  userId = '';
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  timeRemaining = 120; // 2 minutes in seconds
  private seatSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('busId') || '';
    this.userId = this.authService.getCurrentUserId() || '';
    this.loadSeats();

    // Subscribe to seat updates
    this.seatSubscription = this.busService.seats$.subscribe(() => {
      this.seats = this.busService.getSeats(this.busId);
      this.updateSelectedSeats();
    });

    // Start countdown timer
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.seatSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  loadSeats(): void {
    this.seats = this.busService.getSeats(this.busId);
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked') return;

    if (seat.status === 'selected') {
      this.busService.deselectSeat(this.busId, seat.id);
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else if (seat.status === 'available' || (seat.status === 'locked' && seat.lockedBy === this.userId)) {
      this.busService.selectSeat(this.busId, seat.id);
      this.busService.lockSeat(this.busId, seat.id, this.userId);
      this.timeRemaining = 120; // Reset timer
    }
  }

  updateSelectedSeats(): void {
    this.selectedSeats = this.seats.filter(s => s.status === 'selected');
  }

  getSeatClass(seat: Seat): string {
    switch (seat.status) {
      case 'available':
        return 'bg-green-500 border-green-700 text-white hover:bg-green-600';
      case 'selected':
        return 'bg-blue-500 border-blue-700 text-white';
      case 'booked':
        return 'bg-gray-400 border-gray-600 text-white';
      case 'locked':
        return 'bg-yellow-500 border-yellow-700 text-white';
      default:
        return 'bg-gray-300 border-gray-500';
    }
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining > 0 && this.selectedSeats.length > 0) {
        this.timeRemaining--;
      }
      if (this.timeRemaining === 0 && this.selectedSeats.length > 0) {
        alert('Time expired! Seats have been unlocked.');
        this.router.navigate(['/customer/search']);
      }
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getRemainingTime(lockedUntil: Date): number {
    const now = new Date();
    const remaining = Math.max(0, Math.floor((new Date(lockedUntil).getTime() - now.getTime()) / 1000));
    return remaining;
  }

  proceedToPayment(): void {
    if (this.selectedSeats.length > 0) {
      localStorage.setItem('selectedSeats', JSON.stringify(this.selectedSeats.map(s => s.seatNumber)));
      this.router.navigate(['/customer/payment', this.busId]);
    }
  }

  getSelectedSeatNumbers(): string {
    return this.selectedSeats.length > 0
      ? this.selectedSeats.map(s => s.seatNumber).join(', ')
      : 'None';
  }

  goBack(): void {
    this.router.navigate(['/customer/search']);
  }
}
