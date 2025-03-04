'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Loader2, Bell, Calendar, Mail, CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerCronJob } from '@/lib/cron';

interface Reminder {
  _id: string;
  userId: string;
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

export default function AdminReminders() {
  const { data: session } = useSession();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  
  // Fetch reminders
  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/reminders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      
      const data = await response.json();
      setReminders(data.reminders);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to load reminders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (session) {
      fetchReminders();
    }
  }, [session]);
  
  // Manually trigger sending reminders
  const handleSendReminders = async () => {
    try {
      setIsSending(true);
      setSendResult(null);
      setError(null);
      
      const response = await fetch('/api/send-reminders');
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reminders');
      }
      
      setSendResult({
        success: true,
        message: result.message,
        details: result.results,
      });
      
      // Refresh reminders list to show updated status
      fetchReminders();
    } catch (error) {
      console.error('Error sending reminders:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reminders. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };
  
  // Stats for the dashboard
  const totalReminders = reminders.length;
  const sentReminders = reminders.filter(r => r.reminderSent).length;
  const pendingReminders = totalReminders - sentReminders;
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
            Reminder Management
          </h1>
          <p className="mt-2 text-white/60">
            Manage and send event reminders
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Total Reminders</h3>
              <Bell className="text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{totalReminders}</p>
            <p className="text-white/60 text-sm mt-1">All reminders</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Sent Reminders</h3>
              <CheckCircle className="text-green-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{sentReminders}</p>
            <p className="text-white/60 text-sm mt-1">Already sent</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Pending Reminders</h3>
              <Calendar className="text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{pendingReminders}</p>
            <p className="text-white/60 text-sm mt-1">Waiting to be sent</p>
          </motion.div>
        </div>
        
        {/* Manual Trigger */}
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Send Reminders</h2>
            <Button 
              onClick={handleSendReminders} 
              disabled={isSending}
              className="flex items-center gap-2"
              size="lg"
            >
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
              {isSending ? 'Sending...' : 'Send Reminders Now'}
            </Button>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Info className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-white">How to Send Reminders</h3>
                <p className="text-white/70 mt-1">
                  Click the "Send Reminders Now" button to send reminders to all users who have upcoming events. 
                  This will send ALL pending reminders immediately, regardless of their scheduled date.
                </p>
                <p className="text-white/70 mt-2">
                  <strong>Note:</strong> Use this feature with caution as it will send all unsent reminders at once.
                </p>
              </div>
            </div>
          </div>
          
          {sendResult && sendResult.success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 mb-6">
              <h3 className="font-semibold text-lg mb-2">Reminders Sent Successfully!</h3>
              <p>{sendResult.message}</p>
              
              {sendResult.details?.length > 0 ? (
                <>
                  <p className="mt-3 mb-2 font-medium">Details:</p>
                  <ul className="mt-2 space-y-2">
                    {sendResult.details.map((result: any, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm bg-white/5 p-2 rounded-md">
                        {result.status === 'sent' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          {result.status === 'sent' ? (
                            <span>Sent to <strong>{result.email}</strong> for event "<strong>{result.eventName}</strong>"</span>
                          ) : (
                            <span>Failed to send to <strong>{result.id}</strong>: {result.error}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 italic">No reminders were due to be sent at this time.</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
              <h3 className="font-semibold text-lg mb-2">Error</h3>
              <p>{error}</p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reminders List */}
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Reminders</h2>
            <Button 
              onClick={fetchReminders} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh List
            </Button>
          </div>
          
          {/* Add a helpful explanation */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-white/70">
              This list shows all reminders in the system. Reminders with a <span className="text-green-400">Sent</span> status have already been delivered, 
              while those with a <span className="text-yellow-400">Pending</span> status will be sent when you click the "Send Reminders Now" button above.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
              <Bell className="h-12 w-12 mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reminders</h3>
              <p className="text-white/50">
                There are no reminders in the system yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Event</th>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Event Date</th>
                    <th className="text-left py-3 px-4">Reminder Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map((reminder) => (
                    <tr key={reminder._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{reminder.eventName}</td>
                      <td className="py-3 px-4">{reminder.email}</td>
                      <td className="py-3 px-4">
                        {new Date(reminder.eventDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(reminder.reminderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{reminder.reminderType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reminder.reminderSent 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {reminder.reminderSent ? 'Sent' : 'Pending'}
                        </span>
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