import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { AccessibilityService } from '../../core/services/accessibility.service';

import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-sidebar-layout',
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside [class.w-64]="!collapsed" [class.w-20]="collapsed" 
             class="bg-slate-950 text-white transition-all duration-300 flex flex-col border-r border-slate-800 shadow-2xl z-20">
        
        <!-- Header -->
        <div class="p-4 border-b border-slate-800 bg-slate-950">
          <div class="flex items-center justify-between">
            @if (!collapsed) {
              <div class="flex items-center gap-3">
                <app-logo [size]="32"></app-logo>
                <h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">DPT</h1>
              </div>
            }
            <button (click)="toggleSidebar()" class="hover:bg-slate-800 p-2 rounded text-slate-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          @for (item of menuItems; track item.label) {
            @if (!item.adminOnly || isAdmin) {
              <a [routerLink]="item.route" 
                 routerLinkActive="bg-blue-600/20 text-blue-400 border-l-4 border-orange-500 shadow-lg shadow-blue-900/20" 
                 class="flex items-center gap-3 px-3 py-3 rounded-r-lg hover:bg-slate-900 transition-all group border-l-4 border-transparent"
                 [title]="item.label">
                <svg class="w-5 h-5 flex-shrink-0 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
                </svg>
                @if (!collapsed) {
                  <span class="font-medium">{{ item.label }}</span>
                }
              </a>
            }
          }
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
           <button 
            (click)="logout()"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors w-full text-slate-400"
            [title]="'Logout'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            @if (!collapsed) {
              <span>Logout</span>
            }
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto relative bg-slate-950">
        <!-- Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 z-0"></div>
        <!-- Radial Glow -->
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarLayoutComponent implements OnInit {
  collapsed = false;
  isAdmin = false;
  isCustomer = false;
  darkMode = false;

  menuItems: any[] = [];

  private adminMenuItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Manage Buses', route: '/admin/buses', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }, // Adjusted icon for swap/manage
    { label: 'Bookings', route: '/admin/bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  private customerMenuItems = [
    { label: 'Dashboard', route: '/customer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Search Buses', route: '/customer/search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { label: 'My Bookings', route: '/customer/bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'AI Assistant', route: '/customer/chatbot', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { label: 'Sustainability', route: '/customer/sustainability', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Emergency', route: '/customer/emergency', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
  ];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private accessibilityService: AccessibilityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'admin';
    this.isCustomer = this.authService.getRole() === 'customer';
    this.darkMode = this.themeService.isDarkMode();

    if (this.isAdmin) {
      this.menuItems = this.adminMenuItems;
    } else {
      this.menuItems = this.customerMenuItems;
    }
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
    this.darkMode = this.themeService.isDarkMode();
  }

  toggleAccessibility(): void {
    this.accessibilityService.toggleLargeText();
    this.accessibilityService.toggleHighContrast();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
