import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models/models';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
    selector: 'app-my-bookings',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="p-6 md:p-10">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">My Bookings</h1>

      @if (bookings.length > 0) {
        <div class="space-y-4">
          @for (booking of bookings; track booking.id) {
            <div class="card">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ booking.busName }}</h3>
                  <p class="text-slate-600 dark:text-slate-300">{{ booking.source }} → {{ booking.destination }}</p>
                </div>
                <span 
                  [class]="booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'"
                  class="text-white text-sm px-3 py-1 rounded-full">
                  {{ booking.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Booking ID</p>
                  <p class="font-semibold text-slate-900 dark:text-white text-sm">{{ booking.id }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Travel Date</p>
                  <p class="font-semibold text-slate-900 dark:text-white">{{ booking.travelDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Seats</p>
                  <p class="font-semibold text-slate-900 dark:text-white">{{ booking.seats.join(', ') }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                  <p class="font-semibold text-green-600">₹{{ booking.totalAmount }}</p>
                </div>
              </div>

              <div class="flex gap-3">
                <button 
                  (click)="downloadInvoice(booking)"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  Download Invoice
                </button>
                @if (booking.status === 'confirmed') {
                  <button 
                    (click)="cancelBooking(booking.id)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Cancel Booking
                  </button>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-slate-600 dark:text-slate-400 mb-4">No bookings yet</p>
          <a routerLink="/customer/search" class="btn-primary inline-block">Search Buses</a>
        </div>
      }
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class MyBookingsComponent implements OnInit {
    bookings: Booking[] = [];

    constructor(
        private bookingService: BookingService,
        private authService: AuthService,
        private invoiceService: InvoiceService
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        const userId = this.authService.getCurrentUserId();
        if (userId) {
            this.bookingService.getUserBookings(userId).subscribe({
                next: (bookings) => {
                    this.bookings = bookings.sort((a, b) =>
                        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
                    );
                }
            });
        }
    }

    downloadInvoice(booking: Booking): void {
        const payment = {
            id: booking.paymentId,
            bookingId: booking.id,
            amount: booking.totalAmount / 1.18,
            gst: booking.totalAmount - (booking.totalAmount / 1.18),
            totalAmount: booking.totalAmount,
            method: 'UPI' as const,
            status: 'success' as const,
            timestamp: booking.bookingDate
        };
        this.invoiceService.generateInvoice(booking, payment);
    }

    cancelBooking(id: string): void {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.bookingService.cancelBooking(id).subscribe({
                next: () => {
                    this.loadBookings();
                    alert('Booking cancelled successfully');
                }
            });
        }
    }
}
