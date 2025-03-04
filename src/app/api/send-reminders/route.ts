import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import Event from '@/models/Event';
import { sendEmail } from '@/lib/email';
import { generateReminderEmail } from '@/lib/email-templates';

// This endpoint is for sending reminders from the admin panel
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    // In production, require admin authentication
    if (process.env.NODE_ENV === 'production') {
      if (!session || (session.user as any).role !== 'admin') {
        console.error('Unauthorized attempt to send reminders');
        return NextResponse.json(
          { error: 'Unauthorized. Only administrators can send reminders.' },
          { status: 401 }
        );
      }
    }
    
    console.log('Starting to send reminders...');
    
    // Connect to the database
    await dbConnect();
    console.log('Connected to database');
    
    // Get current date
    const now = new Date();
    
    // Find reminders that need to be sent:
    // - All unsent reminders, regardless of date, when triggered from admin panel
    const remindersToSend = await Reminder.find({
      reminderSent: false
    });
    
    console.log(`Found ${remindersToSend.length} reminders to send`);
    
    // Log the actual reminders for debugging
    if (remindersToSend.length > 0) {
      console.log('Reminders to send:', JSON.stringify(remindersToSend.map(r => ({
        id: r._id,
        email: r.email,
        eventName: r.eventName,
        reminderDate: r.reminderDate,
        reminderSent: r.reminderSent
      })), null, 2));
    } else {
      console.log('No reminders found that match the criteria');
      
      // For debugging, let's check how many total reminders exist
      const totalReminders = await Reminder.countDocuments();
      console.log(`Total reminders in database: ${totalReminders}`);
      
      if (totalReminders > 0) {
        // Check if there are any unsent reminders
        const unsentReminders = await Reminder.find({ reminderSent: false });
        console.log(`Total unsent reminders: ${unsentReminders.length}`);
        
        if (unsentReminders.length > 0) {
          console.log('Sample unsent reminder:', JSON.stringify(unsentReminders[0], null, 2));
        }
      }
    }
    
    // Process each reminder
    const results = await Promise.all(
      remindersToSend.map(async (reminder) => {
        try {
          // If the reminder has an eventId, fetch the latest event data
          let eventName = reminder.eventName;
          let eventDate = reminder.eventDate;
          let eventDescription = '';
          let eventImageUrl = '';
          
          if (reminder.eventId) {
            try {
              const event = await Event.findById(reminder.eventId);
              if (event) {
                eventName = event.name;
                eventDate = event.date;
                eventDescription = event.description;
                eventImageUrl = event.imageUrl || '';
              }
            } catch (err) {
              console.error(`Error fetching event ${reminder.eventId}:`, err);
              // Continue with the reminder data we have
            }
          }
          
          // Generate email content using the template
          const emailHtml = generateReminderEmail({
            eventName: eventName,
            eventDate: new Date(eventDate),
            recipientName: reminder.email.split('@')[0], // Simple way to get a name from email
            eventDescription: eventDescription,
            eventImageUrl: eventImageUrl,
          });
          
          // Send the email
          await sendEmail({
            to: reminder.email,
            subject: `Reminder: ${eventName}`,
            html: emailHtml,
          });
          
          // Mark the reminder as sent
          reminder.reminderSent = true;
          await reminder.save();
          
          return {
            id: reminder._id,
            status: 'sent',
            email: reminder.email,
            eventName: eventName,
          };
        } catch (error) {
          console.error(`Error sending reminder ${reminder._id}:`, error);
          return {
            id: reminder._id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );
    
    const successful = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'error').length;
    
    console.log(`Processed ${remindersToSend.length} reminders`);
    console.log(`Successfully sent: ${successful}`);
    console.log(`Failed to send: ${failed}`);
    
    const result = {
      message: `Processed ${remindersToSend.length} reminders`,
      results,
    };
    
    console.log('Finished sending reminders:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders. Please try again later.' },
      { status: 500 }
    );
  }
} 