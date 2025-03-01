'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, addHours, addWeeks } from 'date-fns';
import { Loader2, Calendar, Bell, Clock, Trash2, Edit2, Info, Clock1, Clock3, Clock12, CalendarDays, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { CustomRadioGroup, RadioOption } from '@/components/ui/custom-radio';

// Form validation schema
const reminderFormSchema = z.object({
  eventId: z.string().min(1, 'Please select an event'),
  reminderType: z.enum(['1hour', '1day', '3days', '1week', '2weeks', 'custom']),
  customDate: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive reminders',
  }),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

interface Reminder {
  _id: string;
  userId: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  reminderDate: string;
  reminderType: string;
  email: string;
  phone?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  imageUrl?: string;
  category: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  
  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors } } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      eventId: '',
      reminderType: '1day',
      customDate: '',
      email: '',
      phone: '',
      consent: false,
    },
  });
  
  const selectedEventId = watch('eventId');
  const selectedReminderType = watch('reminderType');
  
  // Reminder type options with icons
  const reminderTypeOptions: RadioOption[] = [
    { id: '1hour', value: '1hour', label: '1 hour before', icon: <Clock1 size={16} /> },
    { id: '1day', value: '1day', label: '1 day before', icon: <Clock size={16} /> },
    { id: '3days', value: '3days', label: '3 days before', icon: <Clock3 size={16} /> },
    { id: '1week', value: '1week', label: '1 week before', icon: <CalendarDays size={16} /> },
    { id: '2weeks', value: '2weeks', label: '2 weeks before', icon: <CalendarRange size={16} /> },
    { id: 'custom', value: 'custom', label: 'Custom date', icon: <Calendar size={16} /> },
  ];
  
  // Fetch user's reminders
  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reminders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      
      const data = await response.json();
      setReminders(data.reminders);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setErrorMessage('Failed to load reminders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      // Only show future events
      const futureEvents = data.events.filter((event: Event) => 
        new Date(event.date) > new Date()
      );
      setEvents(futureEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };
  
  useEffect(() => {
    fetchReminders();
    fetchEvents();
  }, []);
  
  // Update selected event when eventId changes
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e._id === selectedEventId);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);
  
  // Calculate reminder date based on event date and reminder type
  const calculateReminderDate = (eventDate: Date, reminderType: string, customDate?: string): Date => {
    switch (reminderType) {
      case '1hour':
        return addHours(eventDate, -1);
      case '1day':
        return addDays(eventDate, -1);
      case '3days':
        return addDays(eventDate, -3);
      case '1week':
        return addDays(eventDate, -7);
      case '2weeks':
        return addWeeks(eventDate, -2);
      case 'custom':
        return customDate ? new Date(customDate) : eventDate;
      default:
        return addDays(eventDate, -1);
    }
  };
  
  // Find event image URL based on eventId
  const findEventImageUrl = (eventId: string): string | undefined => {
    const event = events.find(e => e._id === eventId);
    return event?.imageUrl;
  };
  
  // Handle form submission
  const onSubmit = async (data: ReminderFormValues) => {
    if (!selectedEvent) return;
    
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      setErrorMessage('');
      
      const eventDate = new Date(selectedEvent.date);
      const reminderDate = calculateReminderDate(
        eventDate,
        data.reminderType,
        data.customDate
      );
      
      // Ensure reminder date is in the future
      if (reminderDate < new Date()) {
        throw new Error('Reminder date must be in the future');
      }
      
      const payload = {
        eventId: data.eventId,
        eventName: selectedEvent.name,
        eventDate: selectedEvent.date,
        reminderType: data.reminderType,
        reminderDate: reminderDate.toISOString(),
        email: data.email,
        phone: data.phone,
      };
      
      const url = editingReminder ? `/api/reminders/${editingReminder._id}` : '/api/reminders';
      const method = editingReminder ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save reminder');
      }
      
      setSubmitStatus('success');
      reset();
      setEditingReminder(null);
      fetchReminders();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Reminder creation error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete a reminder
  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete reminder');
      }
      
      // Refresh reminders list
      fetchReminders();
      
      // If deleting the reminder being edited, reset the form
      if (editingReminder?._id === id) {
        handleCancelEdit();
      }
      
    } catch (err) {
      console.error('Error deleting reminder:', err);
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };
  
  // Set form values for editing
  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setValue('eventId', reminder.eventId);
    setValue('reminderType', reminder.reminderType as any);
    setValue('email', reminder.email);
    setValue('phone', reminder.phone || '');
    setValue('consent', true);
    
    if (reminder.reminderType === 'custom') {
      setValue('customDate', format(new Date(reminder.reminderDate), 'yyyy-MM-dd\'T\'HH:mm'));
    }
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReminder(null);
    reset();
  };
  
  // Convert events to select options
  const eventOptions: SelectOption[] = events.map(event => ({
    value: event._id,
    label: `${event.name} - ${format(new Date(event.date), 'MMM d, yyyy h:mm a')}`
  }));
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
            Event Reminders
          </h1>
          <p className="mt-2 text-white/60">
            Never miss an event! Set up reminders for upcoming events.
          </p>
        </div>
        
        {/* Reminder Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
          </h2>
          
          {submitStatus === 'success' ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400">
              <h3 className="font-semibold">Reminder Set Successfully!</h3>
              <p>You'll receive a reminder before the event.</p>
              <Button 
                onClick={() => setSubmitStatus('idle')} 
                variant="outline" 
                className="mt-3"
              >
                Set Another Reminder
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium mb-2">
                  Select Event <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="eventId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      id="eventId"
                      options={eventOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select an event"
                      error={!!errors.eventId}
                    />
                  )}
                />
                {errors.eventId && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventId.message}</p>
                )}
              </div>
              
              {selectedEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 overflow-hidden"
                >
                  {selectedEvent.imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                      <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={selectedEvent.imageUrl}
                          alt={selectedEvent.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </motion.div>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{selectedEvent.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{selectedEvent.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {format(new Date(selectedEvent.date), 'h:mm a')}
                    </span>
                  </div>
                </motion.div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  When to Receive Reminder <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="reminderType"
                  control={control}
                  render={({ field }) => (
                    <CustomRadioGroup
                      options={reminderTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      name="reminderType"
                      columns={3}
                    />
                  )}
                />
                
                <AnimatePresence>
                  {selectedReminderType === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <label htmlFor="customDate" className="block text-sm font-medium mb-1">
                        Custom Reminder Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="customDate"
                        type="datetime-local"
                        {...register('customDate')}
                        className={errors.customDate ? 'border-red-500' : ''}
                      />
                      {errors.customDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.customDate.message}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number (Optional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (123) 456-7890"
                />
                <p className="text-white/50 text-xs mt-1">
                  For future SMS reminders (not currently available)
                </p>
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
                <label htmlFor="consent" className="text-sm text-white/70">
                  I agree to receive email reminders for this event
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
              
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                  {editingReminder ? 'Update Reminder' : 'Set Reminder'}
                </Button>
                
                {editingReminder && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </motion.div>
        
        {/* User's Reminders */}
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Your Reminders</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
              <Bell className="h-12 w-12 mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reminders Set</h3>
              <p className="text-white/50 max-w-md mx-auto">
                You haven't set any reminders yet. Use the form above to create your first reminder for an upcoming event.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Event Image Thumbnail */}
                    {findEventImageUrl(reminder.eventId) && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={findEventImageUrl(reminder.eventId)}
                            alt={reminder.eventName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/placeholder.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Reminder Content */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{reminder.eventName}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditReminder(reminder)}
                            className="p-1.5 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder._id)}
                            className="p-1.5 rounded-full bg-white/5 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Event: {format(new Date(reminder.eventDate), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          <span>Reminder: {format(new Date(reminder.reminderDate), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-white/50" />
                          <span className={`text-white/50 ${reminder.reminderSent ? 'text-green-400' : ''}`}>
                            {reminder.reminderSent ? 'Reminder sent' : 'Reminder pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 