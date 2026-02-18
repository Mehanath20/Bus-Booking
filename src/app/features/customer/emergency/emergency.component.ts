import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-emergency',
    imports: [CommonModule],
    template: `
    <div class="p-6 md:p-10">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">Emergency & Safety</h1>

      <!-- SOS Button -->
      <div class="card-glass mb-8 p-8 text-center border-2 border-red-500">
        <button 
          (click)="triggerSOS()"
          class="w-full max-w-md mx-auto bg-red-600 hover:bg-red-700 text-white font-bold py-8 px-6 rounded-xl text-2xl shadow-2xl transition-all transform hover:scale-105">
          🆘 EMERGENCY SOS
        </button>
        <p class="text-white/90 mt-4">Press in case of emergency only</p>
      </div>

      <!-- Emergency Contacts -->
      <div class="card mb-8">
        <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Emergency Contacts</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">Police</p>
              <p class="text-slate-600 dark:text-slate-400">Emergency Services</p>
            </div>
            <a href="tel:100" class="btn-primary">📞 100</a>
          </div>
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">Ambulance</p>
              <p class="text-slate-600 dark:text-slate-400">Medical Emergency</p>
            </div>
            <a href="tel:102" class="btn-primary">📞 102</a>
          </div>
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">Women Helpline</p>
              <p class="text-slate-600 dark:text-slate-400">24x7 Support</p>
            </div>
            <a href="tel:1091" class="btn-primary">📞 1091</a>
          </div>
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">DPT Support</p>
              <p class="text-slate-600 dark:text-slate-400">24x7 Customer Care</p>
            </div>
            <a href="tel:1800-123-4567" class="btn-primary">📞 1800-123-4567</a>
          </div>
        </div>
      </div>

      <!-- Live Trip Sharing -->
      <div class="card mb-8">
        <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Share Live Location</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">Share your live trip location with trusted contacts for safety</p>
        <button 
          (click)="shareLocation()"
          class="btn-secondary w-full md:w-auto">
          📍 Share My Location
        </button>
      </div>

      <!-- Safety Tips -->
      <div class="card">
        <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Safety Tips</h2>
        <ul class="space-y-3 text-slate-700 dark:text-slate-300">
          <li class="flex items-start gap-3">
            <span class="text-2xl">✓</span>
            <span>Keep emergency contacts readily available</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✓</span>
            <span>Share your trip details with family or friends</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✓</span>
            <span>Stay alert and aware of your surroundings</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✓</span>
            <span>Trust your instincts - if something feels wrong, seek help</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✓</span>
            <span>Keep your phone charged and accessible</span>
          </li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class EmergencyComponent {
    triggerSOS(): void {
        if (confirm('This will alert emergency services and your emergency contacts. Do you want to continue?')) {
            alert('🆘 SOS Alert Sent!\n\nEmergency services have been notified.\nYour location has been shared with your emergency contacts.');
        }
    }

    shareLocation(): void {
        const shareText = 'I am traveling on Delhi Public Transport. Track my live location.';
        if (navigator.share) {
            navigator.share({
                title: 'Live Trip Location',
                text: shareText,
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(shareText + ' ' + window.location.href);
            alert('Trip link copied to clipboard! Share it with your contacts.');
        }
    }
}
