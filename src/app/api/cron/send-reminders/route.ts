import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import Event from '@/models/Event';
import { sendEmail } from '@/lib/email';
import { generateReminderEmail } from '@/lib/email-templates';

// This endpoint is specifically for automated cron jobs
export async function GET(request: NextRequest) {
  try {
    // Security check - verify CRON_API_KEY to prevent unauthorized access
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      console.error('Unauthorized attempt to send reminders via cron');
      return NextResponse.json(
        { error: 'Unauthorized. Invalid API key.' },
        { status: 401 }
      );
    }
    
    console.log('Starting automated reminder sending...');
    
    // Connect to the database
    await dbConnect();
    console.log('Connected to database');
    
    // Get current date
    const now = new Date();
    
    // Find reminders that need to be sent now:
    // - Unsent reminders
    // - Where reminderDate is in the past or very near future (within the next hour)
    const oneHourFromNow = new Date(now);
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    
    const remindersToSend = await Reminder.find({
      reminderSent: false,
      reminderDate: { $lte: oneHourFromNow }
    });
    
    console.log(`Found ${remindersToSend.length} reminders to send in this batch`);
    
    // Send reminders
    let sentCount = 0;
    const results = [];
    
    for (const reminder of remindersToSend) {
      try {
        // Get the full event details
        const event = await Event.findById(reminder.eventId);
        
        if (!event) {
          console.error(`Event not found for reminder ${reminder._id}`);
          results.push({
            id: reminder._id,
            status: 'error',
            message: 'Event not found'
          });
          continue;
        }
        
        // Generate email content
        const emailHtml = generateReminderEmail({
          eventName: reminder.eventName,
          eventDate: new Date(reminder.eventDate),
          recipientName: reminder.name || 'Event Attendee',
          eventDescription: event.description || '',
          eventImageUrl: event.imageUrl || '',
        });
        
        // Send email
        await sendEmail({
          to: reminder.email,
          subject: `Reminder: ${reminder.eventName}`,
          html: emailHtml,
        });
        
        // Update reminder as sent
        reminder.reminderSent = true;
        reminder.sentAt = new Date();
        await reminder.save();
        
        results.push({
          id: reminder._id,
          status: 'success',
          email: reminder.email,
          eventName: reminder.eventName
        });
        
        sentCount++;
        console.log(`Sent reminder to ${reminder.email} for ${reminder.eventName}`);
      } catch (error) {
        console.error(`Error sending reminder ${reminder._id}:`, error);
        results.push({
          id: reminder._id,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${remindersToSend.length} reminders, sent ${sentCount} successfully`,
      results
    });
  } catch (error) {
    console.error('Error in automated reminder sending:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}
