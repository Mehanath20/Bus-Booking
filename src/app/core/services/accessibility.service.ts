import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AccessibilityService {
    private largeText = false;
    private highContrast = false;
    private speechSynthesis: SpeechSynthesis | null = null;

    constructor() {
        this.loadPreferences();
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
        }
    }

    private loadPreferences(): void {
        this.largeText = localStorage.getItem('largeText') === 'true';
        this.highContrast = localStorage.getItem('highContrast') === 'true';
        this.applySettings();
    }

    toggleLargeText(): void {
        this.largeText = !this.largeText;
        localStorage.setItem('largeText', String(this.largeText));
        this.applySettings();
    }

    toggleHighContrast(): void {
        this.highContrast = !this.highContrast;
        localStorage.setItem('highContrast', String(this.highContrast));
        this.applySettings();
    }

    isLargeText(): boolean {
        return this.largeText;
    }

    isHighContrast(): boolean {
        return this.highContrast;
    }

    private applySettings(): void {
        if (this.largeText) {
            document.documentElement.classList.add('large-text');
        } else {
            document.documentElement.classList.remove('large-text');
        }

        if (this.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }

    speak(text: string): void {
        if (this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.speechSynthesis.speak(utterance);
        }
    }

    stopSpeaking(): void {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }
}
