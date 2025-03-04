import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify admin session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // Mark the message as read - using supabaseAdmin for server-side operations
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Error marking message as read:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update the conversation unread count
    await supabaseAdmin
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', data.conversation_id as string);

    return NextResponse.json({ message: 'Message marked as read', data });
  } catch (error) {
    console.error('Error in message read API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
