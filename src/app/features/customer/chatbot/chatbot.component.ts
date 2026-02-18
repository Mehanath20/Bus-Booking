import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../core/services/gemini.service';
import { BusService } from '../../../core/services/bus.service';
import { ChatMessage } from '../../../core/models/models';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-10">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">AI Assistant</h1>

        <div class="card h-[600px] flex flex-col">
          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            @for (message of messages; track message.id) {
              <div [class]="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
                <div [class]="message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'"
                     class="max-w-[80%] p-4 rounded-lg">
                  <p class="whitespace-pre-wrap">{{ message.message }}</p>
                  <p class="text-xs mt-2 opacity-70">{{ message.timestamp | date:'short' }}</p>
                </div>
              </div>
            }
            @if (loading) {
              <div class="flex justify-start">
                <div class="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg">
                  <div class="flex gap-2">
                    <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          <div class="border-t border-slate-300 dark:border-slate-600 p-4">
            <div class="flex gap-2 items-center">
              <input 
                type="text" 
                [(ngModel)]="userMessage"
                (keyup.enter)="sendMessage()"
                [disabled]="loading"
                class="flex-1 input-field h-12"
                placeholder="Ask about buses, routes, prices...">
              <button 
                (click)="sendMessage()"
                [disabled]="!userMessage.trim() || loading"
                class="btn-primary disabled:opacity-50 h-12 flex items-center justify-center">
                Send
              </button>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
              Ask me about bus schedules, cheapest routes, best travel times, and more!
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
export class ChatbotComponent {
  messages: ChatMessage[] = [
    {
      id: '1',
      sender: 'bot',
      message: 'Hello! I\'m your AI travel assistant. How can I help you today? You can ask me about:\n\n• Cheapest bus routes\n• Best travel times\n• Bus schedules\n• Route suggestions\n• And more!',
      timestamp: new Date()
    }
  ];
  userMessage = '';
  loading = false;

  constructor(
    private geminiService: GeminiService,
    private busService: BusService
  ) { }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.loading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: this.userMessage,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    const query = this.userMessage;
    this.userMessage = '';
    this.loading = true;

    // Get context from available buses
    this.busService.getAllBuses().subscribe({
      next: (buses) => {
        const busContext = buses.map(b =>
          `${b.name}: ${b.source} to ${b.destination}, ₹${b.price}, ${b.duration} mins`
        ).join('; ');

        this.geminiService.chatWithBot(query, busContext).subscribe({
          next: (response) => {
            const botMsg: ChatMessage = {
              id: Date.now().toString(),
              sender: 'bot',
              message: response,
              timestamp: new Date()
            };
            this.messages.push(botMsg);
            this.loading = false;
          },
          error: () => {
            const errorMsg: ChatMessage = {
              id: Date.now().toString(),
              sender: 'bot',
              message: 'Sorry, I encountered an error. Please check your API key configuration and try again.',
              timestamp: new Date()
            };
            this.messages.push(errorMsg);
            this.loading = false;
          }
        });
      }
    });
  }
}
