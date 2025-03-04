import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Define the time after which a chat should be auto-closed (in milliseconds)
const AUTO_CLOSE_TIME = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    // Get all active conversations that haven't had activity in the auto-close period
    const cutoffTime = new Date(Date.now() - AUTO_CLOSE_TIME).toISOString();
    
    // Find conversations to auto-close
    const { data: conversationsToClose, error } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('status', 'active')
      .lt('last_activity', cutoffTime);
    
    if (error) {
      console.error('Error finding inactive conversations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!conversationsToClose || conversationsToClose.length === 0) {
      return NextResponse.json({ message: 'No conversations to close', closed: 0 });
    }
    
    // Get the IDs of conversations to close
    const conversationIds = conversationsToClose.map(convo => convo.id);
    
    // Update status to closed for all inactive conversations
    const { error: updateError } = await supabaseAdmin
      .from('conversations')
      .update({ 
        status: 'closed',
        updated_at: new Date().toISOString(),
        closed_at: new Date().toISOString(),
        closed_reason: 'Auto-closed due to inactivity'
      })
      .in('id', conversationIds);
    
    if (updateError) {
      console.error('Error auto-closing conversations:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: `Auto-closed ${conversationIds.length} inactive conversations`,
      closed: conversationIds.length,
      conversationIds
    });
    
  } catch (error) {
    console.error('Error in auto-close API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
