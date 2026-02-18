import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from '../../../core/services/bus.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Bus } from '../../../core/models/models';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen p-6 md:p-10">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">Payment</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Booking Summary -->
          <div class="card">
            <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Booking Summary</h2>
            @if (bus) {
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">Bus</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ bus.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">Route</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ bus.source }} → {{ bus.destination }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">Departure</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ bus.departureTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">Seats</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ selectedSeats.join(', ') }}</span>
                </div>
                <hr class="my-4 border-slate-300 dark:border-slate-600">
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">Base Fare</span>
                  <span class="font-semibold text-slate-900 dark:text-white">₹{{ baseFare.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600 dark:text-slate-400">GST (18%)</span>
                  <span class="font-semibold text-slate-900 dark:text-white">₹{{ gst.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Total Amount</span>
                  <span>₹{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Payment Method -->
          <div class="card">
            <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Payment Method</h2>
            
            <div class="space-y-4">
              <div>
                <label class="label-text">Select Method</label>
                <select [(ngModel)]="paymentMethod" class="input-field">
                  <option value="UPI">UPI Payment</option>
                  <option value="Card">Card Payment</option>
                  <option value="Split">Split Payment</option>
                </select>
              </div>

              @if (paymentMethod === 'UPI') {
                <div>
                  <label class="label-text">UPI ID</label>
                  <input 
                    type="text" 
                    [(ngModel)]="upiId"
                    class="input-field"
                    placeholder="yourname@paytm">
                </div>
              }

              @if (paymentMethod === 'Split') {
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p class="text-sm text-blue-900 dark:text-blue-300">
                    Split payment allows you to share the cost with friends!
                  </p>
                </div>
              }

              <button 
                (click)="processPayment()"
                [disabled]="processing"
                class="w-full btn-primary text-lg py-4">
                @if (processing) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                } @else {
                  <span>Pay ₹{{ totalAmount.toFixed(2) }}</span>
                }
              </button>
            </div>
          </div>
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
export class PaymentComponent implements OnInit {
  busId = '';
  bus: Bus | null = null;
  selectedSeats: string[] = [];
  baseFare = 0;
  gst = 0;
  totalAmount = 0;
  paymentMethod = 'UPI';
  upiId = '';
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService,
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('busId') || '';
    const seatsJson = localStorage.getItem('selectedSeats');
    this.selectedSeats = seatsJson ? JSON.parse(seatsJson) : [];

    this.loadBusDetails();
  }

  loadBusDetails(): void {
    this.busService.getBusById(this.busId).subscribe({
      next: (bus) => {
        this.bus = bus;
        this.calculatePrice();
      }
    });
  }

  calculatePrice(): void {
    if (this.bus) {
      this.baseFare = this.bus.price * this.selectedSeats.length;
      this.gst = this.baseFare * 0.18;
      this.totalAmount = this.baseFare + this.gst;
    }
  }

  processPayment(): void {
    this.processing = true;

    // Simulate payment processing
    setTimeout(() => {
      const userId = this.authService.getCurrentUserId() || '';

      // Create booking
      const booking = {
        userId,
        busId: this.busId,
        seats: this.selectedSeats,
        travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalAmount: this.totalAmount,
        paymentId: '',
        userName: this.authService.getCurrentUser()?.name || '',
        busName: this.bus?.name || '',
        source: this.bus?.source || '',
        destination: this.bus?.destination || '',
        bookingDate: new Date().toISOString(),
        status: 'confirmed' as const
      };

      this.bookingService.createBooking(booking).subscribe({
        next: (newBooking) => {
          // Create payment record
          const payment = {
            bookingId: newBooking.id,
            amount: this.baseFare,
            gst: this.gst,
            totalAmount: this.totalAmount,
            method: this.paymentMethod as any,
            upiId: this.upiId,
            status: 'success' as const
          };

          this.bookingService.createPayment(payment).subscribe({
            next: () => {
              this.processing = false;
              localStorage.setItem('lastBooking', JSON.stringify(newBooking));
              localStorage.setItem('lastPayment', JSON.stringify(payment));
              localStorage.removeItem('selectedSeats');
              this.router.navigate(['/customer/payment-success']);
            }
          });
        },
        error: () => {
          this.processing = false;
          alert('Payment failed. Please try again.');
        }
      });
    }, 2000);
  }
}
