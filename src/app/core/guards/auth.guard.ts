import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate(['/']);
        return false;
    }

    const startUrl = state.url;
    const userRole = authService.getRole();
    const requiredRole = route.data['role'] as 'admin' | 'customer' | undefined;

    // 1. Check if route requires a specific role
    if (requiredRole && userRole !== requiredRole) {
        // Redirect to their appropriate dashboard
        if (userRole === 'admin') {
            router.navigate(['/admin/dashboard']);
        } else if (userRole === 'customer') {
            router.navigate(['/customer/dashboard']);
        } else {
            router.navigate(['/']);
        }
        return false;
    }

    // 2. Prevent cross-role access (extra safety)
    if (startUrl.startsWith('/admin') && userRole !== 'admin') {
        router.navigate(['/customer/dashboard']);
        return false;
    }

    if (startUrl.startsWith('/customer') && userRole !== 'customer') {
        router.navigate(['/admin/dashboard']);
        return false;
    }

    return true;
};
