'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Plus, Edit2, Trash2, Image, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const eventFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date',
  }),
  imageUrl: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      imageUrl: '',
      category: '',
    },
  });
  
  // Fetch events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories.map((cat: any) => cat.name));
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set some default categories as fallback
      setCategories(['Wedding', 'Corporate', 'Social', 'Burial', 'Decoration']);
    }
  };
  
  useEffect(() => {
    if (session) {
      fetchEvents();
      fetchCategories();
    }
  }, [session]);
  
  // Handle form submission
  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const isEditing = !!data._id;
      const url = '/api/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save event');
      }
      
      // Reset form and refresh events list
      reset();
      setEditingEvent(null);
      fetchEvents();
      
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Set form values for editing
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setValue('_id', event._id);
    setValue('name', event.name);
    setValue('description', event.description);
    setValue('date', format(new Date(event.date), 'yyyy-MM-dd\'T\'HH:mm'));
    setValue('imageUrl', event.imageUrl || '');
    setValue('category', event.category);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEvent(null);
    reset();
  };
  
  // Delete event
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete event');
      }
      
      // Refresh events list
      fetchEvents();
      
      // If deleting the event being edited, reset the form
      if (editingEvent?._id === id) {
        handleCancelEdit();
      }
      
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
            Event Management
          </h1>
          <p className="mt-2 text-white/60">
            Create and manage events for your customers
          </p>
        </div>
        
        {/* Event Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register('date')}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className={`w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Image URL (Optional)
                </label>
                <Input
                  id="imageUrl"
                  {...register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                className={`w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400">
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              
              {editingEvent && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </motion.div>
        
        {/* Events List */}
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Events</h2>
            <Button onClick={fetchEvents} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events</h3>
              <p className="text-white/50">
                There are no events in the system yet. Create your first event above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Event Name</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{event.name}</td>
                      <td className="py-3 px-4">
                        {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          <Tag className="w-3 h-3 mr-1" />
                          {event.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {event.imageUrl ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-white/5">
                            <img 
                              src={event.imageUrl} 
                              alt={event.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-white/30">No image</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(event)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            onClick={() => handleDelete(event._id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 