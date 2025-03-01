import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';

// GET quick replies
export async function GET(request: NextRequest) {
  try {
    // Check for admin privileges on production
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    const { data, error } = await supabaseAdmin
      .from('quick_replies')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quick replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quick replies' },
      { status: 500 }
    );
  }
}

// POST create new quick reply
export async function POST(request: NextRequest) {
  try {
    // Check for admin privileges on production
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
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

// PUT update existing quick reply
export async function PUT(request: NextRequest) {
  try {
    // Check for admin privileges on production
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    const { id, title, content, category } = await request.json();
    
    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'ID, title, and content are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('quick_replies')
      .update({ title, content, category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating quick reply:', error);
    return NextResponse.json(
      { error: 'Failed to update quick reply' },
      { status: 500 }
    );
  }
}

// DELETE quick reply
export async function DELETE(request: NextRequest) {
  try {
    // Check for admin privileges on production
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quick reply ID is required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabaseAdmin
      .from('quick_replies')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quick reply:', error);
    return NextResponse.json(
      { error: 'Failed to delete quick reply' },
      { status: 500 }
    );
  }
} 