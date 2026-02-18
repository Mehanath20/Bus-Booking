import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/models';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly ADMIN_EMAIL = 'admin@delhitransport.com';
    private readonly ADMIN_PASSWORD = 'admin'; // Simplified for demo

    constructor(
        private apiService: ApiService,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Error parsing user from storage', e);
                localStorage.removeItem('currentUser');
            }
        }
    }

    loginAdmin(email: string, password: string): Observable<boolean> {
        // Hardcoded admin check for security simulation
        if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
            const adminUser: User = {
                id: 'admin-001',
                name: 'System Administrator',
                email: this.ADMIN_EMAIL,
                phone: '0000000000',
                role: 'admin',
                points: 0,
                tier: 'Silver',
                createdAt: new Date().toISOString()
            };
            this.setSession(adminUser);
            return of(true);
        }
        return of(false);
    }

    loginCustomer(email: string, password: string): Observable<boolean> {
        return this.apiService.getUserByEmail(email).pipe(
            map(users => {
                if (users.length > 0 && users[0].password === password && users[0].role === 'customer') {
                    // Sanitize user object before storing
                    const { password, ...safeUser } = users[0];
                    this.setSession(safeUser as User);
                    return true;
                }
                return false;
            })
        );
    }

    registerCustomer(userData: User): Observable<User> {
        const newUser = {
            ...userData,
            role: 'customer' as const,
            createdAt: new Date().toISOString(),
            points: 0,
            tier: 'Bronze' as const
        };

        return this.apiService.registerUser(newUser).pipe(
            tap(user => {
                const { password, ...safeUser } = user;
                this.setSession(safeUser as User);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    private setSession(user: User): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getRole(): 'admin' | 'customer' | null {
        return this.currentUserSubject.value?.role || null;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getCurrentUserId(): string | null {
        return this.currentUserSubject.value?.id || null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'admin';
    }

    isCustomer(): boolean {
        return this.getRole() === 'customer';
    }
}
