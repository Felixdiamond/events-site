import { NextRequest, NextResponse } from 'next/server';

// Helper function to make a GET request to another API route
async function callApiRoute(path: string) {
  try {
    // We're server side so we need to construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}${path}`;
    
    console.log(`Calling API: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${path}:`, error);
    throw error;
  }
}

// This route handles all periodic tasks that need to run on a schedule
export async function GET(request: NextRequest) {
  const results: Record<string, any> = {};
  const errors: Record<string, any> = {};
  
  // Run auto-close for stale chat conversations
  try {
    results.chatAutoClose = await callApiRoute('/api/admin/chat-auto-close');
  } catch (error) {
    errors.chatAutoClose = (error as Error).message;
  }
  
  // Add more scheduled tasks here as needed
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  });
}
