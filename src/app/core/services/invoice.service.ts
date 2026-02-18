import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Booking, Payment } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    generateInvoice(booking: Booking, payment: Payment): void {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241); // Indigo color
        doc.text('Delhi Public Transport', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Smart, Safe & Intelligent Mobility', 105, 28, { align: 'center' });

        // Invoice Title
        doc.setFontSize(16);
        doc.text('BOOKING INVOICE', 105, 45, { align: 'center' });

        // Booking Details
        doc.setFontSize(11);
        doc.text(`Invoice ID: ${payment.id}`, 20, 60);
        doc.text(`Booking ID: ${booking.id}`, 20, 68);
        doc.text(`Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, 76);

        // Passenger Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Passenger Details:', 20, 90);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Name: ${booking.userName || 'N/A'}`, 20, 98);
        doc.text(`User ID: ${booking.userId}`, 20, 106);

        // Journey Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Journey Details:', 20, 120);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Bus: ${booking.busName || 'N/A'}`, 20, 128);
        doc.text(`Route: ${booking.source} → ${booking.destination}`, 20, 136);
        doc.text(`Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}`, 20, 144);
        doc.text(`Seats: ${booking.seats.join(', ')}`, 20, 152);

        // Payment Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Details:', 20, 166);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Base Fare: ₹${payment.amount.toFixed(2)}`, 20, 174);
        doc.text(`GST (18%): ₹${payment.gst.toFixed(2)}`, 20, 182);

        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: ₹${payment.totalAmount.toFixed(2)}`, 20, 190);
        doc.setFont('helvetica', 'normal');
        doc.text(`Payment Method: ${payment.method}`, 20, 198);
        doc.text(`Payment Status: ${payment.status.toUpperCase()}`, 20, 206);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for choosing Delhi Public Transport!', 105, 270, { align: 'center' });
        doc.text('For support: support@delhitransport.com | +91-1234567890', 105, 277, { align: 'center' });

        // Save PDF
        doc.save(`invoice-${booking.id}.pdf`);
    }
}
