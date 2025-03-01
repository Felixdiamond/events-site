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

    // Initialize chat stats
    const chatStats = {
      totalConversations: 0,
      activeConversations: 0,
      closedConversations: 0,
      unreadMessages: 0
    };

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized');
      return NextResponse.json(chatStats);
    }

    // Get active conversations count
    const { data: activeConversations, error: activeError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('status', 'active');

    if (!activeError && activeConversations) {
      chatStats.activeConversations = activeConversations.length;
    }

    // Get closed conversations count
    const { data: closedConversations, error: closedError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('status', 'closed');

    if (!closedError && closedConversations) {
      chatStats.closedConversations = closedConversations.length;
    }

    // Calculate total conversations
    chatStats.totalConversations = chatStats.activeConversations + chatStats.closedConversations;

    // Get unread messages count
    const { data: unreadMessages, error: unreadError } = await supabaseAdmin
      .from('messages')
      .select('id')
      .eq('sender_type', 'customer')
      .eq('read', false);

    if (!unreadError && unreadMessages) {
      chatStats.unreadMessages = unreadMessages.length;
    }

    return NextResponse.json(chatStats);
  } catch (error) {
    console.error('Error fetching chat stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat statistics' },
      { status: 500 }
    );
  }
} 