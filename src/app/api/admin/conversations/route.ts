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
    const status = searchParams.get('status'); // 'active', 'closed', or null for all
    const search = searchParams.get('search'); // search term for customer email or name

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized');
      return NextResponse.json({ conversations: [] });
    }

    // Build the query
    let query = supabaseAdmin
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    // Add status filter if provided
    if (status && (status === 'active' || status === 'closed')) {
      query = query.eq('status', status);
    }

    // Add search filter if provided
    if (search) {
      // Search in customer_email or customer_name
      query = query.or(`customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`);
    }

    // Execute the query
    const { data: conversations, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    // Get the conversation data from the request body
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Conversation ID and status are required' },
        { status: 400 }
      );
    }

    // Update the conversation status
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'closed' ? {
          closed_at: new Date().toISOString(),
          closed_reason: 'Closed by administrator'
        } : {})
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ conversation: data });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
} 