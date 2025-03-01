import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    // In production, check for admin role
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized');
      return NextResponse.json({ messages: [] });
    }

    // Fetch messages for the conversation
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Mark customer messages as read
    const unreadMessages = (messages || []).filter(
      (msg) => msg.sender_type === 'customer' && !msg.read
    );

    if (unreadMessages.length > 0 && supabaseAdmin) {
      // Update read status for all unread messages
      await Promise.all(
        unreadMessages.map((msg) =>
          supabaseAdmin
            .from('messages')
            .update({ read: true })
            .eq('id', msg.id)
        )
      );

      // Reset unread count for the conversation
      await supabaseAdmin
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // In production, check for admin role
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    // Get message data from request body
    const { conversationId, content, adminId = 'admin' } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      );
    }

    // Add message to database
    const { data: messageData, error: msgError } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_type: 'admin',
          sender_id: adminId,
          content: content,
          read: false,
        },
      ])
      .select()
      .single();

    if (msgError) {
      throw msgError;
    }

    // Update conversation with last message
    await supabaseAdmin
      .from('conversations')
      .update({
        last_message: content,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return NextResponse.json({ message: messageData });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 