/**
 * Generate a reminder email template
 */
export function generateReminderEmail({
  eventName,
  eventDate,
  recipientName,
  eventDescription,
  eventImageUrl,
}: {
  eventName: string;
  eventDate: Date;
  recipientName?: string;
  eventDescription?: string;
  eventImageUrl?: string;
}) {
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Image HTML to include if an image URL is provided
  const imageHtml = eventImageUrl ? `
    <div style="margin: 20px 0;">
      <img src="${eventImageUrl}" alt="${eventName}" style="max-width: 100%; border-radius: 8px; max-height: 300px; object-fit: cover;" />
    </div>
  ` : '';
  
  // Description HTML to include if a description is provided
  const descriptionHtml = eventDescription ? `
    <p style="margin-bottom: 15px;">${eventDescription}</p>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Event Reminder: ${eventName}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { padding: 20px; }
        .header { 
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content { padding: 20px; }
        .event-details {
          background-color: #f9f9f9;
          border-left: 4px solid #ff7e5f;
          padding: 15px;
          margin: 20px 0;
        }
        .footer { 
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #ff7e5f;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Reminder</h1>
        </div>
        <div class="content">
          <p>Hello ${recipientName || 'there'},</p>
          <p>This is a friendly reminder about your upcoming event:</p>
          
          <div class="event-details">
            <h2>${eventName}</h2>
            ${descriptionHtml}
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
          </div>
          
          ${imageHtml}
          
          <p>We're looking forward to seeing you there!</p>
          <p>If you need to make any changes to your plans, please contact us.</p>
          
          <a href="https://sparklingworldevents.com/contact" class="button">Contact Us</a>
          
          <p>Best regards,<br>The Sparkling World Events Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sparkling World Events. All rights reserved.</p>
          <p>
            <a href="https://sparklingworldevents.com/reminders">Manage Your Reminders</a> | 
            <a href="https://sparklingworldevents.com/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a booking confirmation email template
 */
export function generateBookingConfirmationEmail({
  name,
  eventType,
  eventDate,
  guestCount,
  specialRequests,
  bookingId,
}: {
  name: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  specialRequests?: string;
  bookingId: string;
}) {
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation: ${eventType}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { padding: 20px; }
        .header { 
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content { padding: 20px; }
        .booking-details {
          background-color: #f9f9f9;
          border-left: 4px solid #ff7e5f;
          padding: 15px;
          margin: 20px 0;
        }
        .booking-id {
          font-family: monospace;
          background-color: #eee;
          padding: 5px;
          border-radius: 3px;
        }
        .footer { 
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #ff7e5f;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for booking with Sparkling World Events! Your booking has been confirmed.</p>
          
          <div class="booking-details">
            <h2>${eventType}</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Number of Guests:</strong> ${guestCount}</p>
            ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
            <p><strong>Booking ID:</strong> <span class="booking-id">${bookingId}</span></p>
          </div>
          
          <p>Our team will be in touch shortly to discuss the details of your event.</p>
          <p>If you need to make any changes to your booking, please contact us.</p>
          
          <a href="https://sparklingworldevents.com/contact" class="button">Contact Us</a>
          
          <p>We look forward to making your event special!</p>
          <p>Best regards,<br>The Sparkling World Events Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sparkling World Events. All rights reserved.</p>
          <p>
            <a href="https://sparklingworldevents.com/bookings">Manage Your Bookings</a> | 
            <a href="https://sparklingworldevents.com/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate an admin notification email for new bookings
 */
export function generateAdminBookingNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  eventType,
  eventDate,
  guestCount,
  specialRequests,
  bookingId,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  specialRequests: string;
  bookingId: string;
}) {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = new Date(eventDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Request</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { padding: 20px; }
        .header { 
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content { padding: 20px; }
        .booking-details {
          background-color: #f9f9f9;
          border-left: 4px solid #ff7e5f;
          padding: 15px;
          margin: 20px 0;
        }
        .customer-info {
          background-color: #f0f0f0;
          border-left: 4px solid #3498db;
          padding: 15px;
          margin: 20px 0;
        }
        .booking-id {
          font-family: monospace;
          background-color: #eee;
          padding: 5px;
          border-radius: 3px;
        }
        .footer { 
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #ff7e5f;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request</h1>
        </div>
        <div class="content">
          <p>A new booking request has been submitted:</p>
          
          <div class="booking-details">
            <h2>${eventType}</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Number of Guests:</strong> ${guestCount}</p>
            <p><strong>Special Requests:</strong> ${specialRequests}</p>
            <p><strong>Booking ID:</strong> <span class="booking-id">${bookingId}</span></p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
          </div>
          
          <p>Please review this booking request and contact the customer to confirm availability and provide pricing details.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" class="button">View in Admin Panel</a>
          
          <p>Best regards,<br>Sparkling World Events System</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sparkling World Events. All rights reserved.</p>
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 