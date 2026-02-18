import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Bus, AIRecommendation } from '../models/models';
import { environment } from '../../../environments/environment';

interface GeminiResponse {
    candidates?: Array<{
        content: {
            parts: Array<{ text: string }>;
        };
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    constructor(private http: HttpClient) { }

    getRouteRecommendation(buses: Bus[], query: string): Observable<AIRecommendation> {
        if (!buses || buses.length === 0) {
            return throwError(() => new Error('No buses available'));
        }

        const cheapest = buses.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
        const fastest = buses.reduce((prev, curr) => prev.duration < curr.duration ? prev : curr);
        const leastCrowded = buses.reduce((prev, curr) => prev.occupancy < curr.occupancy ? prev : curr);

        const busContext = buses.map(b =>
            `${b.name}: ₹${b.price}, ${b.duration} mins, ${b.occupancy}% occupied`
        ).join('; ');

        const prompt = `Based on these buses from ${query}: ${busContext}. 
    Provide a brief recommendation (max 3 sentences) explaining which is cheapest (${cheapest.name}), 
    fastest (${fastest.name}), and least crowded (${leastCrowded.name}). 
    Focus on helping the user choose based on their priorities.`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const url = `${environment.gemini.apiUrl}?key=${environment.gemini.apiKey}`;

        return this.http.post<GeminiResponse>(url, body, { headers }).pipe(
            map(response => {
                const text = response.candidates?.[0]?.content?.parts?.[0]?.text ||
                    'AI recommendation unavailable at the moment.';

                return {
                    cheapest,
                    fastest,
                    leastCrowded,
                    explanation: text
                };
            }),
            catchError(error => {
                console.error('Gemini API error:', error);
                return throwError(() => ({
                    cheapest,
                    fastest,
                    leastCrowded,
                    explanation: 'AI recommendation unavailable. Please check your API key configuration.'
                }));
            })
        );
    }

    chatWithBot(message: string, busContext?: string): Observable<string> {
        const context = busContext
            ? `You are a helpful assistant for Delhi Public Transport. Context: ${busContext}. `
            : 'You are a helpful assistant for Delhi Public Transport. ';

        const prompt = `${context}User question: ${message}. 
    Provide a helpful, concise response (max 100 words) related to public transport, 
    bus bookings, travel tips, or route suggestions. If the question is not related 
    to transport, politely redirect to transport-related topics.`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const url = `${environment.gemini.apiUrl}?key=${environment.gemini.apiKey}`;

        return this.http.post<GeminiResponse>(url, body, { headers }).pipe(
            map(response => {
                return response.candidates?.[0]?.content?.parts?.[0]?.text ||
                    'Sorry, I could not process your request at the moment.';
            }),
            catchError(error => {
                console.error('Gemini API Error Details:', {
                    status: error.status,
                    statusText: error.statusText,
                    message: error.message,
                    error: error.error
                });
                return throwError(() => 'Chat service unavailable. Please check your API key configuration.');
            })
        );
    }

    getDemandPrediction(routeData: any): Observable<number[]> {
        // Simulate demand prediction for next 7 days
        const baseValue = Math.floor(Math.random() * 50) + 50;
        const predictions: number[] = [];

        for (let i = 0; i < 7; i++) {
            const trend = baseValue + (i * 2);
            const randomVariation = Math.floor(Math.random() * 20) - 10;
            predictions.push(Math.max(0, trend + randomVariation));
        }

        return new Observable(observer => {
            observer.next(predictions);
            observer.complete();
        });
    }
}
