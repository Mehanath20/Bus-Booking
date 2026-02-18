import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, User } from '../../../core/models/models';

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 md:p-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 mb-2">
          Welcome back, {{ currentUser?.name }}! 👋
        </h1>
        <p class="text-slate-400">Here's your travel overview</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-orange-500/10 transition-all group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm mb-1 group-hover:text-orange-400 transition-colors font-semibold uppercase tracking-wider">Reward Points</p>
              <h3 class="text-3xl font-bold text-white">{{ currentUser?.points || 0 }}</h3>
            </div>
            <div class="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <svg class="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-blue-500/10 transition-all group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm mb-1 group-hover:text-blue-400 transition-colors font-semibold uppercase tracking-wider">Loyalty Tier</p>
              <h3 class="text-3xl font-bold text-white">{{ currentUser?.tier || 'Bronze' }}</h3>
            </div>
            <div class="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg class="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-green-500/10 transition-all group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm mb-1 group-hover:text-green-400 transition-colors font-semibold uppercase tracking-wider">Total Trips</p>
              <h3 class="text-3xl font-bold text-white">{{ bookings.length }}</h3>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <svg class="w-6 h-6 text-green-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-slate-900 border border-slate-700 mb-8">
        <h2 class="text-2xl font-bold mb-4 text-white">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            (click)="navigateTo('/customer/search')"
            class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white hover:shadow-xl hover:shadow-blue-900/40 transition-all border border-blue-400/20 group">
            <div class="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            <div class="text-left">
              <h3 class="font-bold text-lg">Search Buses</h3>
              <p class="text-sm text-blue-100">Find your next journey</p>
            </div>
          </button>

          <button 
            (click)="navigateTo('/customer/bookings')"
            class="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white hover:shadow-xl hover:shadow-orange-900/40 transition-all border border-orange-400/20 group">
            <div class="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
            </div>
            <div class="text-left">
              <h3 class="font-bold text-lg">My Bookings</h3>
              <p class="text-sm text-orange-100">View all bookings</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Upcoming Bookings -->
      <div class="card bg-slate-900 border border-slate-700">
        <h2 class="text-2xl font-bold mb-4 text-white">Upcoming Bookings</h2>
        @if (bookings.length > 0) {
          <div class="space-y-4">
            @for (booking of bookings.slice(0, 3); track booking.id) {
              <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-white text-lg">{{ booking.busName }}</h3>
                    <p class="text-sm text-slate-400">{{ booking.source }} → {{ booking.destination }}</p>
                  </div>
                  <span class="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 uppercase font-bold tracking-wide">{{ booking.status }}</span>
                </div>
                <div class="flex gap-6 text-sm text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  <span class="flex items-center gap-2"><span class="text-blue-400">📅</span> {{ booking.travelDate }}</span>
                  <span class="flex items-center gap-2"><span class="text-orange-400">💺</span> {{ booking.seats.join(', ') }}</span>
                  <span class="flex items-center gap-2"><span class="text-green-400">💰</span> ₹{{ booking.totalAmount }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12 text-slate-500">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="mb-6">No upcoming bookings</p>
            <button 
              (click)="navigateTo('/customer/search')"
              class="btn-primary inline-flex items-center gap-2">
              Book Now
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        }
      </div>
    </div>
    `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  bookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.loadBookings();
    }
  }

  loadBookings(): void {
    const userId = this.currentUser?.id;
    if (userId) {
      this.bookingService.getUserBookings(userId).subscribe({
        next: (bookings) => {
          this.bookings = bookings.filter(b => b.status === 'confirmed');
        }
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
