import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { BusService } from '../../../core/services/bus.service';
import { AdminMetrics, Booking } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-10">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 mb-2">Admin Dashboard</h1>
      <p class="text-slate-400 mb-8">Overview of system performance and logs</p>

      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        @if (metrics) {
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-blue-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-blue-400 transition-colors">Total Users</p>
            <h3 class="text-3xl font-bold text-white">{{ metrics.totalUsers }}</h3>
          </div>
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-blue-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-blue-400 transition-colors">Total Bookings</p>
            <h3 class="text-3xl font-bold text-white">{{ metrics.totalBookings }}</h3>
          </div>
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-green-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-green-400 transition-colors">Revenue</p>
            <h3 class="text-3xl font-bold text-white">₹{{ metrics.totalRevenue.toFixed(0) }}</h3>
          </div>
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-orange-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-orange-400 transition-colors">Popular Route</p>
            <h3 class="text-lg font-bold text-white truncate" [title]="metrics.mostPopularRoute">{{ metrics.mostPopularRoute }}</h3>
          </div>
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-blue-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-blue-400 transition-colors">Peak Hour</p>
            <h3 class="text-3xl font-bold text-white">{{ metrics.peakBookingHour }}:00</h3>
          </div>
          <div class="card bg-slate-900 border border-slate-700 shadow-lg hover:shadow-orange-500/10 transition-all group">
            <p class="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-orange-400 transition-colors">Occupancy</p>
            <h3 class="text-3xl font-bold text-white">{{ metrics.seatOccupancy }}%</h3>
          </div>
        }
      </div>

      <!-- Recent Bookings -->
      <div class="card bg-slate-900 border border-slate-700 mb-8 p-0 overflow-hidden">
        <div class="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Recent Bookings</h2>
            <button routerLink="/admin/bookings" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All &rarr;</button>
        </div>
        
        @if (recentBookings.length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-950/50 text-left">
                  <th class="py-4 px-6 text-slate-400 font-medium text-sm">Booking ID</th>
                  <th class="py-4 px-6 text-slate-400 font-medium text-sm">Customer</th>
                  <th class="py-4 px-6 text-slate-400 font-medium text-sm">Route</th>
                  <th class="py-4 px-6 text-slate-400 font-medium text-sm">Amount</th>
                  <th class="py-4 px-6 text-slate-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @for (booking of recentBookings.slice(0, 5); track booking.id) {
                  <tr class="hover:bg-slate-800/50 transition-colors">
                    <td class="py-4 px-6 text-slate-300 font-mono text-xs">{{ booking.id.substring(0, 8) }}...</td>
                    <td class="py-4 px-6 text-white font-medium">{{ booking.userName || 'N/A' }}</td>
                    <td class="py-4 px-6 text-slate-300 text-sm">{{ booking.source }} → {{ booking.destination }}</td>
                    <td class="py-4 px-6 text-slate-300 font-medium">₹{{ booking.totalAmount }}</td>
                    <td class="py-4 px-6">
                      <span class="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 uppercase tracking-wide font-bold">{{ booking.status }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="text-center py-12">
             <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
             </div>
             <p class="text-slate-500">No recent bookings found</p>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          routerLink="/admin/buses"
          class="card hover:shadow-xl hover:shadow-blue-900/20 hover:border-blue-500/50 transition-all text-left group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg class="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Manage Buses</h3>
              <p class="text-sm text-slate-400 group-hover:text-slate-300">Add, edit, or remove fleet</p>
            </div>
          </div>
        </button>

        <button 
          routerLink="/admin/bookings"
          class="card hover:shadow-xl hover:shadow-orange-900/20 hover:border-orange-500/50 transition-all text-left group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <svg class="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">View Bookings</h3>
              <p class="text-sm text-slate-400 group-hover:text-slate-300">Access full booking logs</p>
            </div>
          </div>
        </button>

        <button class="card hover:shadow-xl hover:shadow-green-900/20 hover:border-green-500/50 transition-all text-left group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <svg class="w-6 h-6 text-green-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Analytics</h3>
              <p class="text-sm text-slate-400 group-hover:text-slate-300">View performance reports</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  metrics: AdminMetrics | null = null;
  recentBookings: Booking[] = [];

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadMetrics();
    this.loadRecentBookings();
  }

  loadMetrics(): void {
    this.adminService.getMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
      }
    });
  }

  loadRecentBookings(): void {
    this.adminService.getAllBookings().subscribe({
      next: (bookings) => {
        this.recentBookings = bookings.sort((a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );
      }
    });
  }
}
