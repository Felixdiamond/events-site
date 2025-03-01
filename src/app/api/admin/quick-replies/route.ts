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

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized');
      return NextResponse.json([]);
    }

    // Get quick replies
    const { data: quickReplies, error } = await supabaseAdmin
      .from('quick_replies')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(quickReplies || []);
  } catch (error) {
    console.error('Error fetching quick replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quick replies' },
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

    // Get data from request body
    const { title, content, category } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create quick reply
    const { data, error } = await supabaseAdmin
      .from('quick_replies')
      .insert([{ title, content, category }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating quick reply:', error);
    return NextResponse.json(
      { error: 'Failed to create quick reply' },
      { status: 500 }
    );
  }
} 