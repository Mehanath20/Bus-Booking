import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <!-- Background Image (Same as Landing) -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" alt="Bus" class="w-full h-full object-cover opacity-20">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/80"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div class="relative z-10 w-full max-w-md p-6">
        <div class="card-glass w-full p-8 fade-in border border-white/10 shadow-2xl backdrop-blur-xl">
          <!-- Back Button -->
          <button 
            (click)="goBack()"
            class="mb-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group">
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </button>

          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 mb-2">Admin Portal</h2>
            <p class="text-slate-400">Secure access for transport officials</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label class="label-text text-slate-300 font-medium">Username or Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  formControlName="username"
                  class="input-field pl-10 focus:ring-blue-500 focus:border-blue-500 bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  placeholder="admin">
              </div>
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <p class="text-red-400 text-sm">Username is required</p>
              }
            </div>

            <div class="space-y-2">
              <label class="label-text text-slate-300 font-medium">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input 
                  type="password" 
                  formControlName="password"
                  class="input-field pl-10 focus:ring-blue-500 focus:border-blue-500 bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  placeholder="••••••••">
              </div>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-400 text-sm">Password is required</p>
              }
            </div>

            @if (errorMessage) {
              <div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ errorMessage }}
              </div>
            }

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || loading"
              class="w-full btn-primary py-3 text-lg font-semibold shadow-lg shadow-blue-900/30">
              @if (loading) {
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </div>
              } @else {
                <span>Access Dashboard</span>
              }
            </button>
            
            <div class="text-center mt-4">
                 <p class="text-slate-500 text-xs">Protected by Delhi Transport Authority Security Systems</p>
            </div>
          </form>
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
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      let { username, password } = this.loginForm.value;

      // Simple alias for admin login
      if (username.toLowerCase() === 'admin') {
        username = 'admin@delhitransport.com';
      }

      this.authService.loginAdmin(username, password).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.errorMessage = 'Invalid admin credentials';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);
          this.errorMessage = 'System error. Please try again later.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
