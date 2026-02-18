import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Bus } from '../../../core/models/models';

@Component({
  selector: 'app-bus-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-10 space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Bus Fleet Management</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Manage routes, pricing, and schedules</p>
        </div>
        <button 
          (click)="openAddModal()"
          class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Bus
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card-glass p-6 flex items-center justify-between bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-blue-500">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Buses</p>
            <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ buses.length }}</p>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
        </div>
        <!-- Add more stats if needed -->
      </div>

      <!-- Bus List -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4">Bus Name</th>
                <th class="px-6 py-4">Route</th>
                <th class="px-6 py-4">Schedule</th>
                <th class="px-6 py-4">Price / Seats</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              @for (bus of buses; track bus.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {{ bus.name }}
                    <div class="text-xs font-normal text-slate-500 mt-0.5 flex gap-1">
                       @for(amenity of bus.amenities; track amenity) {
                         <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{{amenity}}</span>
                       }
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ bus.source }}</span>
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      <span class="font-medium">{{ bus.destination }}</span>
                    </div>
                    <div class="text-xs text-slate-500 mt-1">{{ bus.duration }} mins</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ bus.departureTime }}</span>
                      <span class="text-slate-400 text-xs">to</span>
                      <span class="text-slate-600 dark:text-slate-300">{{ bus.arrivalTime }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-slate-900 dark:text-white">₹{{ bus.price }}</div>
                    <div class="text-xs text-slate-500">{{ bus.totalSeats }} Seats</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="editBus(bus)" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button (click)="deleteBus(bus.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                    <p class="text-lg">No buses found.</p>
                    <button (click)="openAddModal()" class="text-indigo-600 hover:underline mt-2">Add your first bus</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in duration-200">
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ isEditing ? 'Edit Bus' : 'Add New Bus' }}</h2>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2 md:col-span-1">
                <label class="label-text">Bus Name</label>
                <input type="text" [(ngModel)]="currentBus.name" class="input-field" placeholder="e.g. Volvo 9400 Multi-axle">
              </div>
              
              <div class="col-span-2 md:col-span-1">
                <label class="label-text">Price (₹)</label>
                <input type="number" [(ngModel)]="currentBus.price" class="input-field" placeholder="0">
              </div>

              <div>
                <label class="label-text">Source</label>
                <select [(ngModel)]="currentBus.source" class="input-field">
                  <option value="" disabled>Select Source</option>
                  @for(city of cities; track city) { <option [value]="city">{{city}}</option> }
                </select>
              </div>

              <div>
                <label class="label-text">Destination</label>
                <select [(ngModel)]="currentBus.destination" class="input-field">
                  <option value="" disabled>Select Destination</option>
                  @for(city of cities; track city) { <option [value]="city">{{city}}</option> }
                </select>
              </div>

              <div>
                <label class="label-text">Departure Time</label>
                <input type="time" [(ngModel)]="currentBus.departureTime" class="input-field">
              </div>

              <div>
                <label class="label-text">Arrival Time</label>
                <input type="time" [(ngModel)]="currentBus.arrivalTime" class="input-field">
              </div>

              <div>
                <label class="label-text">Duration (mins)</label>
                <input type="number" [(ngModel)]="currentBus.duration" class="input-field">
              </div>

              <div>
                <label class="label-text">Total Seats</label>
                <input type="number" [(ngModel)]="currentBus.totalSeats" class="input-field" value="40">
              </div>
            </div>

            <div class="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
              <button (click)="closeModal()" class="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-colors">Cancel</button>
              <button (click)="saveBus()" class="btn-primary">
                {{ isEditing ? 'Update Bus' : 'Save Bus' }}
              </button>
            </div>
          </div>
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
export class BusManagementComponent implements OnInit {
  buses: Bus[] = [];
  showModal = false;
  isEditing = false;
  currentBus: Partial<Bus> = {};

  // Hardcoded for now, could be from API
  cities = ['Delhi', 'Jaipur', 'Agra', 'Chandigarh', 'Manali', 'Mumbai', 'Pune', 'Bangalore'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.apiService.getBuses().subscribe({
      next: (data) => this.buses = data,
      error: (err) => console.error('Error fetching buses', err)
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentBus = {
      totalSeats: 40,
      availableSeats: 40,
      occupancy: 0,
      amenities: ['AC', 'WiFi', 'Charging Point'],
      rating: 4.5
    };
    this.showModal = true;
  }

  editBus(bus: Bus): void {
    this.isEditing = true;
    this.currentBus = { ...bus };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBus = {};
  }

  saveBus(): void {
    if (!this.isValidBus(this.currentBus)) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditing && this.currentBus.id) {
      this.apiService.updateBus(this.currentBus.id, this.currentBus).subscribe({
        next: () => {
          this.loadBuses();
          this.closeModal();
        },
        error: (err) => alert('Error updating bus')
      });
    } else {
      // New Bus
      const newBus = {
        ...this.currentBus,
        id: Math.random().toString(36).substr(2, 9), // Simple ID gen
        availableSeats: this.currentBus.totalSeats // Reset available
      } as Bus;

      this.apiService.addBus(newBus).subscribe({
        next: () => {
          this.loadBuses();
          this.closeModal();
        },
        error: (err) => alert('Error adding bus')
      });
    }
  }

  deleteBus(id: string): void {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.apiService.deleteBus(id).subscribe({
        next: () => {
          this.loadBuses();
        },
        error: (err) => alert('Error deleting bus')
      });
    }
  }

  private isValidBus(bus: Partial<Bus>): boolean {
    return !!(bus.name && bus.source && bus.destination && bus.price);
  }
}
