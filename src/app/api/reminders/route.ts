import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import Event from '@/models/Event';

// Get all reminders for the current user (identified by email)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    // Build query
    const query: any = {};
    
    if (email) {
      query.email = email;
    }
    
    const reminders = await Reminder.find(query).sort({ eventDate: 1 });
    
    return NextResponse.json({ reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

// Create a new reminder
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['eventId', 'eventName', 'eventDate', 'reminderType', 'reminderDate', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create a userId from the email (simple approach)
    const userId = body.email.split('@')[0];
    
    // Create the reminder
    const reminder = new Reminder({
      userId,
      eventId: body.eventId,
      eventName: body.eventName,
      eventDate: new Date(body.eventDate),
      reminderType: body.reminderType,
      reminderDate: new Date(body.reminderDate),
      email: body.email,
      phone: body.phone,
      reminderSent: false,
    });
    
    await reminder.save();
    
    return NextResponse.json({ 
      message: 'Reminder created successfully',
      reminder 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
} 