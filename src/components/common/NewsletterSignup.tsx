'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  preferences: z.object({
    events: z.boolean().default(true),
    promotions: z.boolean().default(true),
    news: z.boolean().default(true),
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive emails',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'footer';
}

export default function NewsletterSignup({ className = '', variant = 'default' }: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      preferences: {
        events: true,
        promotions: true,
        news: true,
      },
      consent: false,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          preferences: data.preferences,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }
      
      setSubmitStatus('success');
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Different layouts based on variant
  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-grow">
            <Input
              type="email"
              placeholder="Your email address"
              {...register('email')}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Subscribe
          </Button>
        </form>
        
        {submitStatus === 'success' && (
          <p className="text-green-500 text-sm mt-2">Thanks for subscribing!</p>
        )}
        
        {submitStatus === 'error' && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
        
        <div className="mt-2 flex items-center space-x-2">
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="consent-minimal" 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="consent-minimal" className="text-xs text-gray-500">
            I agree to receive emails about events and promotions
          </label>
        </div>
        {errors.consent && (
          <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
        )}
      </div>
    );
  }
  
  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
        <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest events and offers.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              type="email"
              placeholder="Your email address"
              {...register('email')}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="consent-footer" 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label htmlFor="consent-footer" className="text-xs text-gray-400">
              I agree to receive emails about events and promotions
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Subscribe
          </Button>
        </form>
        
        {submitStatus === 'success' && (
          <p className="text-green-500 text-sm mt-2">Thanks for subscribing!</p>
        )}
        
        {submitStatus === 'error' && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    );
  }
  
  // Default variant with full features
  return (
    <div className={`bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${className}`}>
      <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
      <p className="text-gray-400 mb-6">Stay updated with our latest events, promotions, and news.</p>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400">
          <h3 className="font-semibold">Thank you for subscribing!</h3>
          <p>You'll now receive updates about our events and promotions.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name (Optional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              {...register('name')}
            />
          </div>
          
          <div>
            <p className="block text-sm font-medium mb-2">I'm interested in:</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="preferences.events"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <Checkbox 
                      id="events" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="events" className="text-sm">Events and gatherings</label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="preferences.promotions"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <Checkbox 
                      id="promotions" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="promotions" className="text-sm">Special promotions and offers</label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="preferences.news"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <Checkbox 
                      id="news" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="news" className="text-sm">Company news and updates</label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="consent" 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label htmlFor="consent" className="text-sm text-gray-400">
              I agree to receive emails from Sparkling World Events. You can unsubscribe at any time.
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs">{errors.consent.message}</p>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400">
              <p>{errorMessage || 'An error occurred. Please try again.'}</p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Subscribe to Newsletter
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and 
            consent to receive updates from us. We respect your privacy and will never share your information.
          </p>
        </form>
      )}
    </div>
  );
} 