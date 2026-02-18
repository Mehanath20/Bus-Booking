import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-customer-register',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="card-glass max-w-md w-full p-8 fade-in">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="mb-6 text-white/80 hover:text-white flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>

        <h2 class="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p class="text-white/70 mb-8">Join Delhi Public Transport</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="label-text text-white">Full Name</label>
              <input 
                type="text" 
                formControlName="name"
                class="input-field"
                placeholder="John Doe">
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <p class="text-red-400 text-sm mt-1">Name is required</p>
              }
            </div>

            <div>
              <label class="label-text text-white">Email</label>
              <input 
                type="email" 
                formControlName="email"
                class="input-field"
                placeholder="your@email.com">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="text-red-400 text-sm mt-1">Valid email is required</p>
              }
            </div>

            <div>
              <label class="label-text text-white">Phone</label>
              <input 
                type="tel" 
                formControlName="phone"
                class="input-field"
                placeholder="+91 98765 43210">
              @if (registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched) {
                <p class="text-red-400 text-sm mt-1">Phone number is required</p>
              }
            </div>

            <div>
              <label class="label-text text-white">Password</label>
              <input 
                type="password" 
                formControlName="password"
                class="input-field"
                placeholder="Min 6 characters">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="text-red-400 text-sm mt-1">Password must be at least 6 characters</p>
              }
            </div>

            @if (errorMessage) {
              <div class="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg">
                {{ errorMessage }}
              </div>
            }

            @if (successMessage) {
              <div class="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg">
                {{ successMessage }}
              </div>
            }

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || loading"
              class="w-full btn-primary mt-6">
              @if (loading) {
                <span>Creating Account...</span>
              } @else {
                <span>Register</span>
              }
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-white/70">
            Already have an account? 
            <a routerLink="/customer/login" class="text-indigo-300 hover:text-indigo-200 font-semibold ml-1">Login</a>
          </p>
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
export class CustomerRegisterComponent {
    registerForm: FormGroup;
    errorMessage = '';
    successMessage = '';
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            this.authService.registerCustomer(this.registerForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.successMessage = 'Account created! Redirecting...';
                    setTimeout(() => {
                        this.router.navigate(['/customer/dashboard']);
                    }, 1500);
                },
                error: (err) => {
                    this.loading = false;
                    this.errorMessage = 'Registration failed. Email may already be in use.';
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}
