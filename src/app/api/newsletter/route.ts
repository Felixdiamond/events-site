import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Newsletter } from '@/models/Newsletter';
import { z } from 'zod';
import { sendWelcomeEmail, sendUnsubscribeConfirmation } from '@/lib/email';

// Schema for validating newsletter subscription data
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  preferences: z.object({
    events: z.boolean().default(true),
    promotions: z.boolean().default(true),
    news: z.boolean().default(true),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse and validate the request body
    const body = await req.json();
    const validationResult = newsletterSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { email, name, preferences } = validationResult.data;
    
    // Check if the email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      // If already subscribed, update preferences
      if (existingSubscriber.subscribed) {
        await Newsletter.findOneAndUpdate(
          { email },
          { 
            $set: { 
              preferences: preferences || existingSubscriber.preferences,
              name: name || existingSubscriber.name
            } 
          }
        );
        
        return NextResponse.json(
          { message: 'Subscription preferences updated successfully' },
          { status: 200 }
        );
      }
      
      // If previously unsubscribed, resubscribe
      await Newsletter.findOneAndUpdate(
        { email },
        { 
          $set: { 
            subscribed: true,
            preferences: preferences || existingSubscriber.preferences,
            name: name || existingSubscriber.name
          } 
        }
      );
      
      // Send welcome email
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue with the subscription process even if email fails
      }
      
      return NextResponse.json(
        { message: 'Successfully resubscribed to the newsletter' },
        { status: 200 }
      );
    }
    
    // Create a new subscriber
    await Newsletter.create({
      email,
      name,
      subscribed: true,
      subscribedAt: new Date(),
      preferences: preferences || {
        events: true,
        promotions: true,
        news: true,
      },
    });
    
    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with the subscription process even if email fails
    }
    
    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get email from the URL
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find the subscriber
    const subscriber = await Newsletter.findOne({ email });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Update the subscriber to unsubscribed
    await Newsletter.findOneAndUpdate(
      { email },
      { $set: { subscribed: false } }
    );
    
    // Send unsubscribe confirmation email
    try {
      await sendUnsubscribeConfirmation(email);
    } catch (emailError) {
      console.error('Failed to send unsubscribe confirmation email:', emailError);
      // Continue with the unsubscription process even if email fails
    }
    
    return NextResponse.json(
      { message: 'Successfully unsubscribed from the newsletter' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscription' },
      { status: 500 }
    );
  }
} 