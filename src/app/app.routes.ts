import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Public Routes
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./features/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'customer/login',
        loadComponent: () => import('./features/auth/customer-login/customer-login.component').then(m => m.CustomerLoginComponent)
    },
    {
        path: 'customer/register',
        loadComponent: () => import('./features/auth/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent)
    },

    // Customer Routes (Protected)
    {
        path: 'customer',
        loadComponent: () => import('./layout/sidebar-layout/sidebar-layout.component').then(m => m.SidebarLayoutComponent),
        canActivate: [authGuard],
        data: { role: 'customer' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/customer/dashboard/dashboard.component').then(m => m.CustomerDashboardComponent)
            },
            {
                path: 'search',
                loadComponent: () => import('./features/customer/search-buses/search-buses.component').then(m => m.SearchBusesComponent)
            },
            {
                path: 'seat-selection/:busId',
                loadComponent: () => import('./features/customer/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent)
            },
            {
                path: 'payment/:busId',
                loadComponent: () => import('./features/customer/payment/payment.component').then(m => m.PaymentComponent)
            },
            {
                path: 'payment-success',
                loadComponent: () => import('./features/customer/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
            },
            {
                path: 'bookings',
                loadComponent: () => import('./features/customer/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
            },
            {
                path: 'chatbot',
                loadComponent: () => import('./features/customer/chatbot/chatbot.component').then(m => m.ChatbotComponent)
            },
            {
                path: 'sustainability',
                loadComponent: () => import('./features/customer/sustainability/sustainability.component').then(m => m.SustainabilityComponent)
            },
            {
                path: 'emergency',
                loadComponent: () => import('./features/customer/emergency/emergency.component').then(m => m.EmergencyComponent)
            }
        ]
    },

    // Admin Routes (Protected)
    {
        path: 'admin',
        loadComponent: () => import('./layout/sidebar-layout/sidebar-layout.component').then(m => m.SidebarLayoutComponent),
        canActivate: [authGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'buses', // Matches /admin/buses
                loadComponent: () => import('./features/admin/bus-management/bus-management.component').then(m => m.BusManagementComponent)
            },
            {
                path: 'bookings', // Matches /admin/bookings
                loadComponent: () => import('./features/admin/bookings-list/bookings-list.component').then(m => m.BookingsListComponent)
            }
        ]
    },

    // Wildcard
    {
        path: '**',
        redirectTo: ''
    }
];
