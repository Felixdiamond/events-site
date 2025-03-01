'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, isBefore, parse } from 'date-fns';
import { Loader2, Calendar, Users, Clock, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { DatePickerDemo } from '@/components/ui/DatePicker';

// Form validation schema
const bookingFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }).refine(date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(today, date);
  }, {
    message: 'Event date must be in the future',
  }),
  eventTime: z.string().min(1, 'Please select a time'),
  guestCount: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().min(1, 'Please enter a valid number of guests')
  ),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Event type options for the select
const eventTypeOptions: SelectOption[] = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Birthday Party', label: 'Birthday Party' },
  { value: 'Corporate Event', label: 'Corporate Event' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Graduation', label: 'Graduation' },
  { value: 'Baby Shower', label: 'Baby Shower' },
  { value: 'Engagement Party', label: 'Engagement Party' },
  { value: 'Funeral/Memorial', label: 'Funeral/Memorial' },
  { value: 'Other', label: 'Other' },
];

// Time options for the select
const timeOptions: SelectOption[] = Array.from({ length: 24 * 4 }).map((_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const displayTime = format(parse(time, 'HH:mm', new Date()), 'h:mm a');
  return { value: time, label: displayTime };
});

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventTime: '',
      guestCount: undefined,
      specialRequests: '',
    },
  });
  
  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Format the date and time for submission
      const eventDateTime = new Date(data.eventDate);
      const [hours, minutes] = data.eventTime.split(':').map(Number);
      eventDateTime.setHours(hours, minutes);
      
      const bookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: eventDateTime.toISOString(),
        guestCount: Number(data.guestCount),
        specialRequests: data.specialRequests,
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }
      
      setSubmitStatus('success');
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="relative bg-secondary py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
          <motion.div
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Book Your Event
            </motion.h1>
            <motion.p 
              className="text-lg text-white/70 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Let us help you create an unforgettable experience. Fill out the form below to request a booking for your special event.
            </motion.p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Booking Request Submitted!</h2>
                <p className="text-white/70 mb-6">
                  Thank you for your booking request. We'll review your details and get back to you within 24 hours to confirm your booking.
                </p>
                <p className="text-white/70 mb-8">
                  A confirmation email has been sent to your email address with the details of your request.
                </p>
                <Button onClick={() => setSubmitStatus('idle')}>Book Another Event</Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Event Booking Form</h2>
                
                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
                    <h3 className="font-semibold">Error</h3>
                    <p>{errorMessage}</p>
                  </div>
                )}
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Mail className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-medium text-white">Booking Information</h3>
                      <p className="text-white/70 mt-1">
                        Your booking request will be sent to our events team. We'll review your request and contact you within 24 hours to confirm availability and provide pricing details.
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        {...register('name')}
                        className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    
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
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      {...register('phone')}
                      className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium mb-1">
                      Event Type <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="eventType"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          id="eventType"
                          options={eventTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select an event type"
                          error={!!errors.eventType}
                        />
                      )}
                    />
                    {errors.eventType && (
                      <p className="text-red-500 text-xs mt-1">{errors.eventType.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium mb-1">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="eventDate"
                        control={control}
                        render={({ field }) => (
                          <DatePickerDemo
                            date={field.value}
                            onSelect={field.onChange}
                            className="w-full"
                          />
                        )}
                      />
                      {errors.eventDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.eventDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="eventTime" className="block text-sm font-medium mb-1">
                        Event Time <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="eventTime"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            id="eventTime"
                            options={timeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select a time"
                            error={!!errors.eventTime}
                          />
                        )}
                      />
                      {errors.eventTime && (
                        <p className="text-red-500 text-xs mt-1">{errors.eventTime.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="guestCount" className="block text-sm font-medium mb-1">
                      Number of Guests <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="guestCount"
                        type="number"
                        min="1"
                        placeholder="Estimated number of guests"
                        {...register('guestCount')}
                        className={`w-full ${errors.guestCount ? 'border-red-500' : ''}`}
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.guestCount && (
                      <p className="text-red-500 text-xs mt-1">{errors.guestCount.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium mb-1">
                      Special Requests (Optional)
                    </label>
                    <Textarea
                      id="specialRequests"
                      rows={4}
                      placeholder="Any special requirements or additional information"
                      {...register('specialRequests')}
                      className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit Booking Request
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 