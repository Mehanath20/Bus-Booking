import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sustainability',
    imports: [CommonModule],
    template: `
    <div class="p-6 md:p-10">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">Sustainability Impact</h1>

      <div class="card-glass mb-8 p-8 text-center">
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-5xl font-bold text-white mb-2">{{ co2Saved }} kg</h2>
        <p class="text-2xl text-white/80 mb-6">CO₂ Saved</p>
        <p class="text-white/70">By choosing public transport over private vehicles</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card text-center">
          <div class="text-5xl mb-4">🌳</div>
          <h3 class="text-3xl font-bold text-green-600 mb-2">{{ treesEquivalent }}</h3>
          <p class="text-slate-600 dark:text-slate-400">Trees Saved Equivalent</p>
        </div>

        <div class="card text-center">
          <div class="text-5xl mb-4">🚌</div>
          <h3 class="text-3xl font-bold text-indigo-600 mb-2">{{ totalTrips }}</h3>
          <p class="text-slate-600 dark:text-slate-400">Total Eco-Trips</p>
        </div>

        <div class="card text-center">
          <div class="text-5xl mb-4">📏</div>
          <h3 class="text-3xl font-bold text-purple-600 mb-2">{{ totalDistance }} km</h3>
          <p class="text-slate-600 dark:text-slate-400">Distance Traveled</p>
        </div>
      </div>

      <div class="card mt-8">
        <h3 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Environmental Impact</h3>
        <div class="space-y-4">
          <div>
            <p class="text-slate-600 dark:text-slate-400 mb-2">🌍 By using public transport, you've contributed to:</p>
            <ul class="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>Reduced traffic congestion in urban areas</li>
              <li>Lower air pollution levels</li>
              <li>Decreased carbon footprint</li>
              <li>Sustainable urban development</li>
            </ul>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p class="text-green-900 dark:text-green-300 font-semibold">
              Keep up the great work! Every journey on public transport makes a difference. 🌱
            </p>
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
export class SustainabilityComponent {
    co2Saved = 145.5;
    treesEquivalent = 12;
    totalTrips = 8;
    totalDistance = 1250;
}
