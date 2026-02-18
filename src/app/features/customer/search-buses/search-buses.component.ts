import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { GeminiService } from '../../../core/services/gemini.service';
import { Bus, AIRecommendation } from '../../../core/models/models';

@Component({
  selector: 'app-search-buses',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-10 space-y-8">
      <!-- Header -->
      <div class="text-center md:text-left">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Find Your Bus</h1>
        <p class="text-slate-500 dark:text-slate-400">Search available routes and book your seat instantly</p>
      </div>

      <!-- Search Form -->
      <div class="card-glass p-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-200 dark:border-indigo-800">
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          <div class="md:col-span-3">
            <label class="label-text">From</label>
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="source"
                class="input-field pl-10"
                placeholder="Source City">
              <span class="absolute left-3 top-3.5 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </span>
            </div>
          </div>
          
          <div class="md:col-span-1 flex justify-center pb-2">
            <button class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" (click)="swapLocations()">
              <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </button>
          </div>

          <div class="md:col-span-3">
            <label class="label-text">To</label>
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="destination"
                class="input-field pl-10"
                placeholder="Destination City">
              <span class="absolute left-3 top-3.5 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-center">
          <button 
            (click)="searchBuses()"
            [disabled]="loading"
            class="btn-primary w-full md:w-auto min-w-[200px] text-lg">
            @if (loading) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Searching...
              </span>
            } @else {
              <span>Search Buses</span>
            }
          </button>
        </div>
      </div>

      <!-- AI Recommendation -->
      @if (aiRecommendation && filteredBuses.length > 0) {
        <div class="card-glass p-6 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-indigo-100 rounded-lg dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Travel Insights</h3>
              <p class="text-slate-600 dark:text-slate-300 mb-4">{{ aiRecommendation.explanation }}</p>
              
              <div class="flex flex-wrap gap-3">
                 @if(aiRecommendation.cheapest) {
                   <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">💰 Best Value: {{aiRecommendation.cheapest.name}}</div>
                 }
                 @if(aiRecommendation.fastest) {
                   <div class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">⚡ Fastest: {{aiRecommendation.fastest.name}}</div>
                 }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Bus List -->
      @if (hasSearched) {
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ filteredBuses.length }} Buses Found</h2>
            <!-- Sort Filters could go here -->
          </div>

          @if (loading) {
             <!-- Skeleton Loader could go here -->
          } @else if (filteredBuses.length > 0) {
            <div class="grid gap-6">
              @for (bus of filteredBuses; track bus.id) {
                <div class="card hover:border-indigo-500 transition-all duration-300 border border-transparent shadow-md hover:shadow-xl">
                  <div class="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ bus.name }}</h3>
                        <div class="flex gap-1">
                          @for (amenity of bus.amenities; track amenity) {
                            <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">{{amenity}}</span>
                          }
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-8 text-sm">
                        <div class="text-center">
                          <p class="font-bold text-lg text-slate-700 dark:text-slate-200">{{ bus.departureTime }}</p>
                          <p class="text-slate-500 uppercase text-xs">{{ bus.source }}</p>
                        </div>
                        <div class="flex flex-col items-center">
                          <p class="text-xs text-slate-400 mb-1">{{ bus.duration }} mins</p>
                          <div class="w-24 h-[2px] bg-slate-300 relative">
                             <div class="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-300"></div>
                             <div class="absolute -top-1 left-0 w-2 h-2 rounded-full bg-slate-300"></div>
                          </div>
                        </div>
                        <div class="text-center">
                          <p class="font-bold text-lg text-slate-700 dark:text-slate-200">{{ bus.arrivalTime }}</p>
                          <p class="text-slate-500 uppercase text-xs">{{ bus.destination }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col items-end gap-3 min-w-[140px]">
                      <div class="text-right">
                        <p class="text-3xl font-bold text-indigo-600">₹{{ bus.price }}</p>
                        <p class="text-xs text-slate-500">{{ bus.availableSeats }} seats left</p>
                      </div>
                      <button 
                        (click)="bookBus(bus.id)"
                        class="btn-primary w-full text-center">
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-16">
               <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
               </div>
               <h3 class="text-lg font-medium text-slate-900 dark:text-white">No buses found</h3>
               <p class="text-slate-500">Try changing your search date or route</p>
            </div>
          }
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
export class SearchBusesComponent implements OnInit {
  source = 'Delhi';
  destination = 'Jaipur';
  buses: Bus[] = [];
  filteredBuses: Bus[] = [];
  loading = false;
  hasSearched = false; // Track if a search has been performed
  aiRecommendation: AIRecommendation | null = null;

  constructor(
    private apiService: ApiService,
    private geminiService: GeminiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Automatically search on load if defaults are set
    if (this.source && this.destination) {
      this.searchBuses();
    }
  }

  swapLocations(): void {
    const temp = this.source;
    this.source = this.destination;
    this.destination = temp;
  }

  searchBuses(): void {
    if (!this.source || !this.destination) return;

    this.loading = true;
    this.hasSearched = true;

    this.apiService.getBuses().subscribe({
      next: (buses) => {
        this.buses = buses;
        // Client-side filtering for robust searching
        this.filteredBuses = buses.filter(bus =>
          bus.source.toLowerCase().includes(this.source.toLowerCase()) &&
          bus.destination.toLowerCase().includes(this.destination.toLowerCase())
        );

        this.loading = false;

        if (this.filteredBuses.length > 0) {
          this.getAIRecommendation();
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAIRecommendation(): void {
    const query = `${this.source} to ${this.destination}`;
    this.geminiService.getRouteRecommendation(this.filteredBuses, query).subscribe({
      next: (recommendation) => {
        this.aiRecommendation = recommendation;
      },
      error: (err) => {
        console.error('AI recommendation failed:', err);
      }
    });
  }

  bookBus(busId: string): void {
    this.router.navigate(['/customer/seat-selection', busId]);
  }
}
