import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';

// Update a reminder by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const id = (await params).id;
    const body = await request.json();
    
    // Find and update the reminder
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { 
        ...body,
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        reminderDate: body.reminderDate ? new Date(body.reminderDate) : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Reminder updated successfully',
      reminder 
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// Delete a reminder by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const id = (await params).id;
    
    // Find and delete the reminder
    const reminder = await Reminder.findByIdAndDelete(id);
    
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Reminder deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}

// Get a reminder by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const id = (await params).id;
    
    // Find the reminder
    const reminder = await Reminder.findById(id);
    
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ reminder });
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminder' },
      { status: 500 }
    );
  }
}