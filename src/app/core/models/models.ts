// User Model
export interface User {
    id?: string;
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: 'customer' | 'admin';
    createdAt?: string;
    points?: number;
    tier?: 'Bronze' | 'Silver' | 'Gold';
}

// Bus Model
export interface Bus {
    id: string;
    name: string;
    source: string;
    destination: string;
    price: number;
    duration: number; // in minutes
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    availableSeats: number;
    occupancy: number; // percentage
    amenities: string[];
    rating: number;
}

// Seat Model
export interface Seat {
    id: string;
    seatNumber: string;
    status: 'available' | 'booked' | 'locked' | 'selected';
    lockedUntil?: Date;
    lockedBy?: string;
}

// Booking Model
export interface Booking {
    id: string;
    userId: string;
    busId: string;
    seats: string[];
    bookingDate: string;
    travelDate: string;
    totalAmount: number;
    status: 'confirmed' | 'cancelled' | 'completed';
    paymentId: string;
    userName?: string;
    busName?: string;
    source?: string;
    destination?: string;
}

// Payment Model
export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    gst: number;
    totalAmount: number;
    method: 'UPI' | 'Card' | 'Split';
    upiId?: string;
    status: 'success' | 'pending' | 'failed' | 'refunded';
    timestamp: string;
    splitWith?: string[];
}

// Admin Metrics Model
export interface AdminMetrics {
    totalUsers: number;
    totalBookings: number;
    totalRevenue: number;
    mostPopularRoute: string;
    peakBookingHour: number;
    seatOccupancy: number;
}

// Chart Data Model
export interface ChartData {
    name: string;
    value: number;
}

// AI Recommendation Model
export interface AIRecommendation {
    cheapest: Bus | null;
    fastest: Bus | null;
    leastCrowded: Bus | null;
    explanation: string;
}

// Trip Model
export interface Trip {
    bookingId: string;
    currentLocation: { lat: number; lng: number };
    route: { lat: number; lng: number }[];
    boardingPoint: { lat: number; lng: number };
    droppingPoint: { lat: number; lng: number };
    eta: number; // in minutes
}

// Gamification Model
export interface Gamification {
    userId: string;
    points: number;
    tier: 'Bronze' | 'Silver' | 'Gold';
    coupons: Coupon[];
    travelScore: number;
    nextTierPoints: number;
}

export interface Coupon {
    id: string;
    code: string;
    discount: number;
    expiresAt: string;
    used: boolean;
}

// Sustainability Model
export interface SustainabilityImpact {
    userId: string;
    totalDistance: number;
    co2Saved: number;
    treesEquivalent: number;
    totalTrips: number;
}

// Chat Message Model
export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: Date;
}
