'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  preferences: z.object({
    events: z.boolean().default(true),
    promotions: z.boolean().default(true),
    news: z.boolean().default(true),
  }),
  testEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsletterEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      content: getDefaultTemplate(),
      preferences: {
        events: true,
        promotions: true,
        news: true,
      },
      testEmail: '',
    },
  });
  
  const onSubmit = async (data: FormValues, isTest: boolean = false) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      const payload = {
        subject: data.subject,
        content: data.content,
        preferences: data.preferences,
        ...(isTest && data.testEmail ? { testEmail: data.testEmail } : {}),
      };
      
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send newsletter');
      }
      
      setSubmitStatus('success');
      
      if (isTest) {
        // Don't reset form after test send
      } else {
        reset();
        setValue('content', getDefaultTemplate());
      }
      
    } catch (error) {
      console.error('Newsletter sending error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTestSend = () => {
    setIsTesting(true);
    handleSubmit((data) => onSubmit(data, true))();
  };
  
  return (
    <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6">Send Newsletter</h2>
      
      {submitStatus === 'success' && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 mb-6">
          <h3 className="font-semibold">Success!</h3>
          <p>{isTesting ? 'Test newsletter sent successfully.' : 'Newsletter sent to all subscribers successfully.'}</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject Line <span className="text-red-500">*</span>
          </label>
          <Input
            id="subject"
            type="text"
            placeholder="Newsletter Subject"
            {...register('subject')}
            className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
          />
          {errors.subject && (
            <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            HTML Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={15}
            {...register('content')}
            className={`w-full px-3 py-2 bg-secondary/50 border ${errors.content ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
          )}
          <p className="text-xs text-white/50 mt-1">
            You can use HTML to format your newsletter. Use the template provided as a starting point.
          </p>
        </div>
        
        <div>
          <p className="block text-sm font-medium mb-2">Send to subscribers interested in:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="events" {...register('preferences.events')} defaultChecked />
              <label htmlFor="events" className="text-sm">Events and gatherings</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="promotions" {...register('preferences.promotions')} defaultChecked />
              <label htmlFor="promotions" className="text-sm">Special promotions and offers</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="news" {...register('preferences.news')} defaultChecked />
              <label htmlFor="news" className="text-sm">Company news and updates</label>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <label htmlFor="testEmail" className="block text-sm font-medium mb-1">
            Test Email (Optional)
          </label>
          <div className="flex gap-3">
            <Input
              id="testEmail"
              type="email"
              placeholder="your@email.com"
              {...register('testEmail')}
              className={`flex-1 ${errors.testEmail ? 'border-red-500' : ''}`}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestSend}
              disabled={isSubmitting}
            >
              {isSubmitting && isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Send
            </Button>
          </div>
          {errors.testEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.testEmail.message}</p>
          )}
          <p className="text-xs text-white/50 mt-1">
            Send a test email to verify the content before sending to all subscribers.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="px-6" 
            disabled={isSubmitting}
          >
            {isSubmitting && !isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send Newsletter
          </Button>
        </div>
      </form>
    </div>
  );
}

function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sparkling World Business & Events Newsletter</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container { padding: 20px; }
    .header { 
      background: linear-gradient(to right, #ff7e5f, #feb47b);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content { padding: 20px; }
    .footer { 
      text-align: center;
      font-size: 12px;
      color: #666;
      padding: 20px;
    }
    .button {
      display: inline-block;
      background-color: #ff7e5f;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sparkling World Business & Events Newsletter</h1>
    </div>
    <div class="content">
      <h2>Hello from Sparkling World Business & Events!</h2>
      <p>Welcome to our newsletter. Here's what's new:</p>
      
      <h3>Upcoming Events</h3>
      <p>We have some exciting events coming up:</p>
      <ul>
        <li>Event 1 - Date and details</li>
        <li>Event 2 - Date and details</li>
      </ul>
      
      <h3>Special Offers</h3>
      <p>Check out our latest promotions:</p>
      <p>Promotion details go here...</p>
      
      <a href="https://sparklingworldevents.com/events" class="button">View All Events</a>
      
      <p>We look forward to seeing you at our next event!</p>
      <p>Best regards,<br>The Sparkling World Business & Events Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Sparkling World Business & Events. All rights reserved.</p>
      <p>
        <a href="https://sparklingworldevents.com/unsubscribe">Unsubscribe</a> | 
        <a href="https://sparklingworldevents.com/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
} 