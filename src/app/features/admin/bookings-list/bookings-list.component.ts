import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Booking } from '../../../core/models/models';

@Component({
  selector: 'app-bookings-list',
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-10 space-y-6">
      <div class="flex justify-between items-center">
         <div>
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white">All Bookings</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">View and manage customer reservations</p>
         </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="card-glass p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-l-4 border-emerald-500">
           <div>
             <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Bookings</p>
             <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ bookings.length }}</p>
           </div>
        </div>
        <div class="card-glass p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-l-4 border-indigo-500">
           <div>
             <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
             <p class="text-3xl font-bold text-slate-800 dark:text-white">₹{{ totalRevenue }}</p>
           </div>
        </div>
      </div>

      @if (bookings.length > 0) {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th class="px-6 py-4">Booking ID</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Route Info</th>
                  <th class="px-6 py-4">Travel Date</th>
                  <th class="px-6 py-4">Seats</th>
                  <th class="px-6 py-4">Amount</th>
                  <th class="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                @for (booking of bookings; track booking.id) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ booking.id }}</td>
                    <td class="px-6 py-4">
                        <div class="font-medium text-slate-900 dark:text-white">{{ booking.userName || 'Guest' }}</div>
                        <div class="text-xs text-slate-500">{{ booking.userId }}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-slate-900 dark:text-white font-medium">{{ booking.busName || 'Bus ' + booking.busId }}</div>
                        <div class="text-xs text-slate-500">{{ booking.source }} → {{ booking.destination }}</div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {{ booking.travelDate | date:'mediumDate' }}
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-1">
                            @for(seat of booking.seats; track seat) {
                                <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-medium">{{seat}}</span>
                            }
                        </div>
                    </td>
                    <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">₹{{ booking.totalAmount }}</td>
                    <td class="px-6 py-4">
                      <span 
                        [class.bg-green-100]="booking.status === 'confirmed'"
                        [class.text-green-700]="booking.status === 'confirmed'"
                        [class.bg-red-100]="booking.status === 'cancelled'"
                        [class.text-red-700]="booking.status === 'cancelled'"
                        class="px-2.5 py-1 rounded-full text-xs font-medium capitalize">
                        {{ booking.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No bookings yet</h3>
            <p class="text-slate-500 dark:text-slate-400">Bookings will appear here once customers start reserving seats.</p>
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
export class BookingsListComponent implements OnInit {
  bookings: Booking[] = [];
  totalRevenue = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.apiService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings.sort((a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );
        this.calculateRevenue();
      },
      error: (err) => console.error('Error fetching bookings', err)
    });
  }

  calculateRevenue(): void {
    this.totalRevenue = this.bookings.reduce((sum, booking) => sum + (booking.status === 'confirmed' ? booking.totalAmount : 0), 0);
  }
}
