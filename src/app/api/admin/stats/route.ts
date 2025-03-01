import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import { supabaseAdmin } from '@/lib/supabase-admin';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import Reminder from '@/models/Reminder';
import { Newsletter } from '@/models/Newsletter';

export async function GET(req: NextRequest) {
  try {
    // In production, check for admin role
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Initialize stats object
    const stats = {
      totalEvents: 0,
      activeReminders: 0,
      newsletterSubscribers: 0,
      activeChats: 0
    };

    // Connect to database
    await dbConnect();

    // Get events count
    const events = await Event.find();
    stats.totalEvents = events.length;

    // Get active reminders count
    const reminders = await Reminder.find({ reminderSent: false });
    stats.activeReminders = reminders.length;

    // Get active newsletter subscribers count
    const subscribers = await Newsletter.find({ subscribed: true });
    stats.newsletterSubscribers = subscribers.length;

    // Get active chat conversations count
    if (supabaseAdmin) {
      try {
        const { data: conversations, error } = await supabaseAdmin
          .from('conversations')
          .select('id')
          .eq('status', 'active');

        if (!error && conversations) {
          stats.activeChats = conversations.length;
        }
      } catch (supabaseError) {
        console.error('Error fetching chat stats from Supabase:', supabaseError);
        // Continue with other stats even if Supabase fails
      }
    } else {
      console.warn('Supabase admin client is not initialized - chat stats will be 0');
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 