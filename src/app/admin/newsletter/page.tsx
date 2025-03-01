'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Loader2, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsletterEditor from '@/components/admin/NewsletterEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt: string;
  preferences: {
    events: boolean;
    promotions: boolean;
    news: boolean;
  };
}

export default function AdminNewsletter() {
  const { data: session } = useSession();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('send');
  
  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/subscribers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      
      const data = await response.json();
      setSubscribers(data.subscribers);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError('Failed to load subscribers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (session) {
      fetchSubscribers();
    }
  }, [session]);
  
  // Stats for the dashboard
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.subscribed).length;
  const unsubscribed = totalSubscribers - activeSubscribers;
  
  const interestedInEvents = subscribers.filter(s => s.subscribed && s.preferences.events).length;
  const interestedInPromotions = subscribers.filter(s => s.subscribed && s.preferences.promotions).length;
  const interestedInNews = subscribers.filter(s => s.subscribed && s.preferences.news).length;
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
            Newsletter Management
          </h1>
          <p className="mt-2 text-white/60">
            Send newsletters and manage subscribers
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Total Subscribers</h3>
              <Users className="text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{totalSubscribers}</p>
            <p className="text-white/60 text-sm mt-1">All-time subscribers</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Subscribers</h3>
              <Mail className="text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{activeSubscribers}</p>
            <p className="text-white/60 text-sm mt-1">Currently receiving emails</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Events Interest</h3>
              <div className="text-primary text-sm font-medium">{Math.round((interestedInEvents / activeSubscribers) * 100) || 0}%</div>
            </div>
            <p className="text-3xl font-bold mt-2">{interestedInEvents}</p>
            <p className="text-white/60 text-sm mt-1">Interested in events</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Promotions Interest</h3>
              <div className="text-primary text-sm font-medium">{Math.round((interestedInPromotions / activeSubscribers) * 100) || 0}%</div>
            </div>
            <p className="text-3xl font-bold mt-2">{interestedInPromotions}</p>
            <p className="text-white/60 text-sm mt-1">Interested in promotions</p>
          </motion.div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="send" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="send">Send Newsletter</TabsTrigger>
            <TabsTrigger value="subscribers">Manage Subscribers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-6">
            <NewsletterEditor />
          </TabsContent>
          
          <TabsContent value="subscribers" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                {error}
              </div>
            ) : (
              <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Subscribers</h2>
                  <Button onClick={fetchSubscribers} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Subscribed On</th>
                        <th className="text-left py-3 px-4">Preferences</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">{subscriber.email}</td>
                          <td className="py-3 px-4">{subscriber.name || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              subscriber.subscribed 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {subscriber.preferences.events && (
                                <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary-light">
                                  Events
                                </span>
                              )}
                              {subscriber.preferences.promotions && (
                                <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary-light">
                                  Promos
                                </span>
                              )}
                              {subscriber.preferences.news && (
                                <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary-light">
                                  News
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {subscribers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">No subscribers found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 