import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <!-- Background Image -->
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
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 mb-2">Customer Login</h2>
            <p class="text-slate-400">Welcome back! Please login to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label class="label-text text-slate-300 font-medium">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input 
                  type="email" 
                  formControlName="email"
                  class="input-field pl-10 focus:ring-blue-500 focus:border-blue-500 bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  placeholder="your@email.com">
              </div>
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="text-red-400 text-sm">Valid email is required</p>
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
                  <span>Logging in...</span>
                </div>
              } @else {
                <span>Login</span>
              }
            </button>
          </form>

          <div class="mt-8 text-center pt-6 border-t border-white/10">
            <p class="text-slate-400">
              Don't have an account? 
              <a routerLink="/customer/register" class="text-blue-400 hover:text-blue-300 font-semibold ml-1 transition-colors hover:underline underline-offset-4">Register Now</a>
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
export class CustomerLoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.loginCustomer(email, password).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/customer/dashboard']);
          } else {
            this.errorMessage = 'Invalid email or password';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error', err);
          this.errorMessage = 'Connection error. Please ensuring server is running.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
