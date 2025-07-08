import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking, { IBooking } from '@/models/Booking';
import { sendEmail } from '@/lib/email';
import { generateBookingConfirmationEmail, generateAdminBookingNotificationEmail } from '@/lib/email-templates';

// Admin booking email from environment variables
const BOOKING_EMAIL = process.env.BOOKING_EMAIL || 'admin@sparklingworldevents.com';

// GET all bookings or a specific booking
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    
    await dbConnect();
    
    if (id) {
      // Get a specific booking by ID
      const booking = await Booking.findById(id);
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ booking });
    } else if (email) {
      // Get bookings by email
      const bookings = await Booking.find({ email }).sort({ eventDate: 1 });
      return NextResponse.json({ bookings });
    } else {
      // Get all bookings (admin only in a real app)
      const bookings = await Booking.find().sort({ eventDate: 1 });
      return NextResponse.json({ bookings });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'eventType', 'eventDate', 'guestCount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    await dbConnect();
    
    // Check if the event date is available
    const existingBookings = await Booking.find({
      eventDate: new Date(body.eventDate),
      status: { $ne: 'cancelled' },
    });
    
    // In a real app, you would check capacity and availability here
    // For now, we'll just limit to a maximum of 3 events per day
    if (existingBookings.length >= 3) {
      return NextResponse.json(
        { error: 'This date is already fully booked. Please select another date.' },
        { status: 400 }
      );
    }
    
    // Create the booking
    const booking = new Booking({
      ...body,
      status: 'pending',
      confirmationSent: false,
    });
    
    await booking.save();
    
    // Send confirmation email to the customer
    try {
      const emailHtml = generateBookingConfirmationEmail({
        name: booking.name,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
        specialRequests: booking.specialRequests,
        bookingId: booking._id.toString(),
      });
      
      await sendEmail({
        to: booking.email,
        subject: `Booking Confirmation: ${booking.eventType}`,
        html: emailHtml,
      });
      
      // Mark confirmation as sent
      booking.confirmationSent = true;
      await booking.save();
      
      // Send notification email to admin
      const adminEmailHtml = generateAdminBookingNotificationEmail({
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
        specialRequests: booking.specialRequests || 'None',
        bookingId: booking._id.toString(),
      });
      
      await sendEmail({
        to: BOOKING_EMAIL,
        subject: `New Booking Request: ${booking.eventType}`,
        html: adminEmailHtml,
        replyTo: booking.email,
      });
      
      console.log(`Booking notification sent to admin at ${BOOKING_EMAIL}`);
      
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Continue with the booking process even if email fails
    }
    
    return NextResponse.json({ 
      message: 'Booking created successfully',
      booking 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// PUT update a booking
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // If status is being changed to 'confirmed', set confirmationSent to false
    // so that a confirmation email can be sent
    if (body.status === 'confirmed') {
      body.confirmationSent = false;
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      body._id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Send status update email if status changed to confirmed and confirmation not sent
    if (updatedBooking.status === 'confirmed' && !updatedBooking.confirmationSent) {
      try {
        const emailHtml = generateBookingConfirmationEmail({
          name: updatedBooking.name,
          eventType: updatedBooking.eventType,
          eventDate: updatedBooking.eventDate,
          guestCount: updatedBooking.guestCount,
          specialRequests: updatedBooking.specialRequests,
          bookingId: updatedBooking._id.toString(),
        });
        
        await sendEmail({
          to: updatedBooking.email,
          subject: `Booking Confirmed: ${updatedBooking.eventType}`,
          html: emailHtml,
        });
        
        // Mark confirmation as sent
        updatedBooking.confirmationSent = true;
        await updatedBooking.save();
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Continue with the booking update process even if email fails
      }
    }
    
    return NextResponse.json({ 
      message: 'Booking updated successfully',
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE a booking
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // In a real app, you might want to soft delete by setting status to 'cancelled'
    // instead of actually deleting the record
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    // Optionally send cancellation email
    try {
      await sendEmail({
        to: booking.email,
        subject: `Booking Cancelled: ${booking.eventType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ff7e5f;">Booking Cancelled</h1>
            <p>Hello ${booking.name},</p>
            <p>Your booking for ${booking.eventType} on ${booking.eventDate.toLocaleDateString()} has been cancelled.</p>
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br>The Sparkling World Business & Events Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Continue with the cancellation process even if email fails
    }
    
    return NextResponse.json({ 
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
} 