'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Loader2, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Bell, 
  Calendar, 
  Mail, 
  Users, 
  Settings, 
  LogOut,
  MessageCircle,
  ChartBarStacked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { MdOutlineEventAvailable } from 'react-icons/md';

interface AdminModule {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface DashboardStats {
  totalEvents: number;
  activeReminders: number;
  newsletterSubscribers: number;
  activeChats: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeReminders: 0,
    newsletterSubscribers: 0,
    activeChats: 0
  });
  
  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // Use the new API endpoint to get all stats at once
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    if (session) {
      fetchStats();
      
      // Start loading animation and then hide it
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [session]);
  
  // Define admin modules
  const adminModules: AdminModule[] = [
    {
      name: 'Events',
      description: 'Create and manage events',
      icon: <Calendar className="h-6 w-6" />,
      href: '/admin/events',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Gallery',
      description: 'Manage image gallery',
      icon: <ImageIcon className="h-6 w-6" />,
      href: '/admin/gallery',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Categories',
      description: 'Manage Event Categories',
      icon: <ChartBarStacked className="h-6 w-6" />,
      href: '/admin/categories',
      color: 'from-brown-500 to-brown-600',
    },
    {
      name: 'Bookings',
      description: 'Manage customer bookings',
      icon: <MdOutlineEventAvailable className="h-6 w-6" />,
      href: '/admin/bookings',
      color: 'from-pink-500 to-pink-600',
    },
    {
      name: 'Chat',
      description: 'Manage customer conversations',
      icon: <MessageCircle className="h-6 w-6" />,
      href: '/admin/chat',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      name: 'Reminders',
      description: 'Manage event reminders',
      icon: <Bell className="h-6 w-6" />,
      href: '/admin/reminders',
      color: 'from-amber-500 to-amber-600',
    },
    {
      name: 'Newsletter',
      description: 'Manage newsletter subscribers',
      icon: <Mail className="h-6 w-6" />,
      href: '/admin/newsletter',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Settings',
      description: 'System settings',
      icon: <Settings className="h-6 w-6" />,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-600',
    },
  ];
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/60 mb-6">You need to be logged in to access the admin dashboard.</p>
          <Link href="/admin/login">
            <Button>Log In</Button>
          </Link>
        </div>
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
              Admin Dashboard
            </h1>
            <p className="mt-2 text-white/60">
              Welcome back, {session?.user?.name || 'Admin'}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={module.href} className="block h-full">
                <div className={`h-full bg-gradient-to-br ${module.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {module.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{module.name}</h2>
                  <p className="text-white/80">{module.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold mb-1">Total Events</h3>
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">{stats.totalEvents}</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold mb-1">Active Reminders</h3>
              <div className="flex items-center justify-between">
                <Bell className="h-8 w-8 text-amber-500" />
                <span className="text-2xl font-bold">{stats.activeReminders}</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold mb-1">Newsletter Subscribers</h3>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold">{stats.newsletterSubscribers}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold mb-1">Active Conversations</h3>
              <div className="flex items-center justify-between">
                <MessageCircle className="h-8 w-8 text-cyan-500" />
                <span className="text-2xl font-bold">{stats.activeChats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 