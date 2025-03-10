import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import Event from '@/models/Event';
import { sendEmail } from '@/lib/email';
import { generateReminderEmail } from '@/lib/email-templates';

/**
 * Standalone script to send reminders
 * This can be executed by a cron job on any hosting platform
 */
async function sendReminders() {
  try {
    console.log('Starting reminder sending process...');
    
    // Connect to the database
    await dbConnect();
    console.log('Connected to database');
    
    // Get current date
    const now = new Date();
    
    // Find reminders that need to be sent:
    // - reminderDate is in the past or today
    // - reminderSent is false
    const remindersToSend = await Reminder.find({
      $and: [
        { reminderSent: false },
        {
          $or: [
            // Reminders with date in the past
            { reminderDate: { $lt: now } },
            // Reminders due today
            {
              reminderDate: {
                $gte: new Date(now.setHours(0, 0, 0, 0)),
                $lte: new Date(now.setHours(23, 59, 59, 999))
              }
            }
          ]
        }
      ]
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
    
    return {
      message: `Processed ${remindersToSend.length} reminders`,
      results,
    };
  } catch (error) {
    console.error('Error processing reminders:', error);
    throw error;
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  sendReminders()
    .then(() => {
      console.log('Reminder sending process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error in reminder sending process:', error);
      process.exit(1);
    });
}

export default sendReminders; 