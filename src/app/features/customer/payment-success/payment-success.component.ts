import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="card max-w-2xl w-full text-center fade-in">
        <!-- Success Animation -->
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-scale">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h1 class="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p class="text-xl text-slate-600 dark:text-slate-300 mb-8">Your booking has been confirmed</p>

        @if (booking) {
          <div class="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg mb-8 text-left">
            <h3 class="font-bold text-lg mb-4 text-slate-900 dark:text-white">Booking Details</h3>
            <div class="space-y-2">
              <p><span class="text-slate-600 dark:text-slate-400">Booking ID:</span> <span class="font-semibold">{{ booking.id }}</span></p>
              <p><span class="text-slate-600 dark:text-slate-400">Bus:</span> <span class="font-semibold">{{ booking.busName }}</span></p>
              <p><span class="text-slate-600 dark:text-slate-400">Route:</span> <span class="font-semibold">{{ booking.source }} → {{ booking.destination }}</span></p>
              <p><span class="text-slate-600 dark:text-slate-400">Travel Date:</span> <span class="font-semibold">{{ booking.travelDate }}</span></p>
              <p><span class="text-slate-600 dark:text-slate-400">Seats:</span> <span class="font-semibold">{{ booking.seats.join(', ') }}</span></p>
              <p><span class="text-slate-600 dark:text-slate-400">Total Paid:</span> <span class="font-semibold text-green-600">₹{{ booking.totalAmount }}</span></p>
            </div>
          </div>
        }

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            (click)="downloadInvoice()"
            class="btn-primary">
            📄 Download Invoice
          </button>
          <button 
            routerLink="/customer/bookings"
            class="btn-secondary">
            📋 View My Bookings
          </button>
          <button 
            routerLink="/customer/dashboard"
            class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all">
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    </div>

    <style>
      @keyframes scale {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
      .animate-scale {
        animation: scale 0.5s ease-in-out;
      }
    </style>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  booking: any = null;
  payment: any = null;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const bookingJson = localStorage.getItem('lastBooking');
    const paymentJson = localStorage.getItem('lastPayment');

    this.booking = bookingJson ? JSON.parse(bookingJson) : null;
    this.payment = paymentJson ? JSON.parse(paymentJson) : null;

    if (!this.booking) {
      this.router.navigate(['/customer/dashboard']);
    }
  }

  downloadInvoice(): void {
    if (this.booking && this.payment) {
      this.invoiceService.generateInvoice(this.booking, this.payment);
    }
  }
}
