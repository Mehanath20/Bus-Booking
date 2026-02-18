import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <div class="relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-950">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" alt="Bus" class="w-full h-full object-cover opacity-20 transition-opacity duration-700 hover:opacity-30">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/80"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <!-- Navbar -->
      <nav class="relative z-20 w-full px-6 py-4 grid grid-cols-3 items-center backdrop-blur-sm border-b border-white/5">
        <div class="flex justify-start items-center gap-3">
          <app-logo [size]="40"></app-logo>
          <span class="text-xl font-bold text-white tracking-tight hidden sm:block">Delhi Public Transport</span>
        </div>
        
        <div class="hidden md:flex justify-center items-center gap-8 text-slate-300 font-medium">
          <a routerLink="/" class="hover:text-white transition-colors">Home</a>
          <a href="#" class="hover:text-white transition-colors">Routes</a>
          <a href="#" class="hover:text-white transition-colors">Schedule</a>
          <a href="#" class="hover:text-white transition-colors">Contact</a>
        </div>

        <div class="flex justify-end items-center gap-4">
          <a routerLink="/customer/login" class="text-white hover:text-blue-300 font-medium transition-colors hidden sm:block">
            Log in
          </a>
          <a routerLink="/customer/register" class="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-bold hover:bg-blue-50 transition-colors shadow-lg">
            Sign Up
          </a>
        </div>
      </nav>

      <!-- Content -->
      <div class="relative z-10 container mx-auto px-4 text-center flex-1 flex flex-col justify-center">
        <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
          
          <div class="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-4 animate-in slide-in-from-top duration-1000">
            <span class="text-blue-400 text-sm font-semibold tracking-wider uppercase">Official Delhi Transport App</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-orange-500 drop-shadow-2xl mb-6 tracking-tight">
            Delhi Public Transport
          </h1>
          
          <p class="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
            Fast, reliable, and secure. Experience the next generation of urban mobility with real-time tracking and seamless booking.
          </p>

          <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a routerLink="/customer/login" class="btn-primary flex items-center gap-3 px-8 py-4 text-lg shadow-blue-900/20 shadow-xl border border-orange-400/20">
              <span class="relative z-10 font-bold">Customer Login</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>

            <a routerLink="/admin/login" class="btn-secondary px-8 py-4 text-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 backdrop-blur-md shadow-xl">
              <span class="font-bold text-blue-100">Admin Portal</span>
            </a>
          </div>

          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
             <div class="p-6 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
               <div class="text-4xl font-extrabold text-blue-500 mb-2">500+</div>
               <div class="text-slate-400 font-medium">Active Buses</div>
             </div>
             <div class="p-6 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1">
               <div class="text-4xl font-extrabold text-orange-500 mb-2">24/7</div>
               <div class="text-slate-400 font-medium">Customer Support</div>
             </div>
             <div class="p-6 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1">
               <div class="text-4xl font-extrabold text-green-500 mb-2">100k+</div>
               <div class="text-slate-400 font-medium">Happy Riders</div>
             </div>
          </div>

          <div class="mt-12">
             <!-- Spacer to push content up if needed -->
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
export class LandingComponent { }
