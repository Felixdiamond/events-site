'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, Calendar, Users, Mail, Phone, ArrowLeft, Check, X, Clock, Search, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { DatePickerDemo } from '@/components/ui/DatePicker';

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  confirmationSent: boolean;
}

// Status options for filtering
const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Event type options for filtering
const eventTypeOptions: SelectOption[] = [
  { value: 'all', label: 'All Event Types' },
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

export default function AdminBookingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
      setFilteredBookings(data.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (session) {
      fetchBookings();
    }
  }, [session]);
  
  // Apply filters
  useEffect(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.name.toLowerCase().includes(term) || 
        booking.email.toLowerCase().includes(term) ||
        booking.phone.toLowerCase().includes(term) ||
        booking._id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply event type filter
    if (eventTypeFilter !== 'all') {
      result = result.filter(booking => booking.eventType === eventTypeFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter(booking => {
        const eventDate = new Date(booking.eventDate);
        return (
          eventDate.getDate() === filterDate.getDate() &&
          eventDate.getMonth() === filterDate.getMonth() &&
          eventDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }
    
    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, eventTypeFilter, dateFilter]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setEventTypeFilter('all');
    setDateFilter(null);
    setIsFilterOpen(false);
  };
  
  // Update booking status
  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setIsUpdating(true);
      
      const bookingToUpdate = bookings.find(b => b._id === id);
      if (!bookingToUpdate) return;
      
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingToUpdate,
          status,
        }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update booking');
      }
      
      // Refresh bookings
      fetchBookings();
      
      // Update selected booking if it's the one being updated
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({
          ...selectedBooking,
          status,
        });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle booking selection for details view
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  
  const closeDetails = () => {
    setSelectedBooking(null);
  };
  
  // Render booking status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };
  
  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Booking Management
            </h1>
            <p className="mt-2 text-white/60">
              View and manage event bookings
            </p>
          </div>
          
          <Link href="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/2">
              <Input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              <Button onClick={fetchBookings}>
                Refresh
              </Button>
            </div>
          </div>
          
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <CustomSelect
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Select status"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Type
                </label>
                <CustomSelect
                  options={eventTypeOptions}
                  value={eventTypeFilter}
                  onChange={setEventTypeFilter}
                  placeholder="Select event type"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Date
                </label>
                <DatePickerDemo
                  date={dateFilter}
                  onSelect={(date) => setDateFilter(date)}
                  className="w-full"
                />
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bookings List */}
          <div className="md:col-span-2 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">All Bookings</h2>
              <p className="text-white/60 text-sm mt-1">
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-400">{error}</p>
                <Button onClick={fetchBookings} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
                <p className="text-white/60 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter
                    ? 'No bookings match your current filters. Try changing your search or filter criteria.'
                    : 'There are no bookings in the system yet.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                      selectedBooking?._id === booking._id ? 'bg-white/5' : ''
                    }`}
                    onClick={() => handleSelectBooking(booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{booking.name}</h3>
                        <p className="text-white/60 text-sm">{booking.eventType}</p>
                      </div>
                      {renderStatusBadge(booking.status)}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        {format(new Date(booking.eventDate), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                        {booking.guestCount} guests
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                        {booking.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Booking Details */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            {selectedBooking ? (
              <div>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Booking Details</h2>
                  <Button size="sm" variant="ghost" onClick={closeDetails}>
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Status</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'pending' ? 'default' : 'outline'}
                        className={selectedBooking.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                        onClick={() => updateBookingStatus(selectedBooking._id, 'pending')}
                        disabled={isUpdating || selectedBooking.status === 'pending'}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'confirmed' ? 'default' : 'outline'}
                        className={selectedBooking.status === 'confirmed' ? 'bg-green-600 hover:bg-green-700' : ''}
                        onClick={() => updateBookingStatus(selectedBooking._id, 'confirmed')}
                        disabled={isUpdating || selectedBooking.status === 'confirmed'}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'cancelled' ? 'default' : 'outline'}
                        className={selectedBooking.status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                        onClick={() => updateBookingStatus(selectedBooking._id, 'cancelled')}
                        disabled={isUpdating || selectedBooking.status === 'cancelled'}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Event Details</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="block text-white/40">Event Type</span>
                          <span className="font-medium">{selectedBooking.eventType}</span>
                        </div>
                        <div>
                          <span className="block text-white/40">Guests</span>
                          <span className="font-medium">{selectedBooking.guestCount}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-white/40">Date & Time</span>
                          <span className="font-medium">
                            {format(new Date(selectedBooking.eventDate), 'PPP')} at {format(new Date(selectedBooking.eventDate), 'p')}
                          </span>
                        </div>
                        {selectedBooking.specialRequests && (
                          <div className="col-span-2">
                            <span className="block text-white/40">Special Requests</span>
                            <span className="font-medium">{selectedBooking.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Details */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Customer Details</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="block text-white/40">Name</span>
                          <span className="font-medium">{selectedBooking.name}</span>
                        </div>
                        <div>
                          <span className="block text-white/40">Email</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedBooking.email}</span>
                            <a
                              href={`mailto:${selectedBooking.email}?subject=Your Booking for ${selectedBooking.eventType}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-light"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                        <div>
                          <span className="block text-white/40">Phone</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedBooking.phone}</span>
                            <a
                              href={`tel:${selectedBooking.phone}`}
                              className="text-primary hover:text-primary-light"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Metadata */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Booking Info</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="block text-white/40">Booking ID</span>
                          <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">{selectedBooking._id}</span>
                        </div>
                        <div>
                          <span className="block text-white/40">Created</span>
                          <span className="font-medium">{format(new Date(selectedBooking.createdAt), 'PP')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => window.open(`mailto:${selectedBooking.email}?subject=Your Booking for ${selectedBooking.eventType}`, '_blank')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email Customer
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.open(`tel:${selectedBooking.phone}`, '_blank')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Booking Selected</h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Select a booking from the list to view its details and manage it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 