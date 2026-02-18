import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkMode = false;

    constructor() {
        this.loadThemePreference();
    }

    private loadThemePreference(): void {
        const savedTheme = localStorage.getItem('darkMode');
        this.darkMode = savedTheme === 'true';
        this.applyTheme();
    }

    toggleDarkMode(): void {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', String(this.darkMode));
        this.applyTheme();
    }

    isDarkMode(): boolean {
        return this.darkMode;
    }

    private applyTheme(): void {
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}
