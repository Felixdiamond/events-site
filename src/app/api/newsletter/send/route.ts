import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import dbConnect from '@/lib/db';
import { Newsletter } from '@/models/Newsletter';
import { sendNewsletter } from '@/lib/email';
import { z } from 'zod';

// Schema for validating newsletter sending data
const sendNewsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  preferences: z.object({
    events: z.boolean().optional(),
    promotions: z.boolean().optional(),
    news: z.boolean().optional(),
  }).optional(),
  testEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();
    
    // Parse and validate the request body
    const body = await req.json();
    const validationResult = sendNewsletterSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { subject, content, preferences, testEmail } = validationResult.data;
    
    // If testEmail is provided, send only to that email for testing
    if (testEmail) {
      const result = await sendNewsletter({
        recipients: [testEmail],
        subject,
        html: content,
      });
      
      return NextResponse.json({
        message: 'Test newsletter sent successfully',
        result,
      });
    }
    
    // Build query for subscribers based on preferences
    const query: any = { subscribed: true };
    
    if (preferences) {
      const preferenceFilters = [];
      
      if (preferences.events) {
        preferenceFilters.push({ 'preferences.events': true });
      }
      
      if (preferences.promotions) {
        preferenceFilters.push({ 'preferences.promotions': true });
      }
      
      if (preferences.news) {
        preferenceFilters.push({ 'preferences.news': true });
      }
      
      if (preferenceFilters.length > 0) {
        query.$or = preferenceFilters;
      }
    }
    
    // Get all active subscribers matching the preferences
    const subscribers = await Newsletter.find(query);
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found matching the criteria' },
        { status: 404 }
      );
    }
    
    // Extract email addresses
    const recipientEmails = subscribers.map(sub => sub.email);
    
    // Send the newsletter
    const result = await sendNewsletter({
      recipients: recipientEmails,
      subject,
      html: content,
    });
    
    return NextResponse.json({
      message: 'Newsletter sent successfully',
      result: {
        total: result.total,
        sent: result.sent,
        failed: result.failed,
      },
    });
    
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
} 