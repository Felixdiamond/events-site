'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Send, 
  Clock, 
  Check, 
  X, 
  ArrowLeft, 
  Search, 
  User, 
  Calendar, 
  MessageCircle,
  Loader2, 
  Inbox
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  customer_email: string;
  customer_name: string;
  status: 'active' | 'closed';
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'admin';
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface QuickReply {
  id: string;
  title: string;
  content: string;
  category?: string;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      
      // Build query string with filters
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Use our new API endpoint
      const response = await fetch(`/api/admin/conversations?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error fetching conversations: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.conversations) {
        setConversations(data.conversations);
        setFilteredConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch messages for active conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      // Use our new API endpoint
      const response = await fetch(`/api/admin/messages?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
        
        // Update conversation in the list to reset unread count
        if (data.messages.length > 0) {
          setConversations(conversations.map((convo) =>
            convo.id === conversationId ? { ...convo, unread_count: 0 } : convo
          ));
          setFilteredConversations(
            filterConversations(
              conversations.map((convo) =>
                convo.id === conversationId ? { ...convo, unread_count: 0 } : convo
              ),
              searchTerm,
              statusFilter
            )
          );
        }
      }
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // Fetch quick replies
  const fetchQuickReplies = async () => {
    try {
      // Use our new API endpoint
      const response = await fetch('/api/admin/quick-replies');
      if (!response.ok) {
        throw new Error(`Error fetching quick replies: ${response.statusText}`);
      }
      
      const data = await response.json();
      setQuickReplies(data || []);
    } catch (error) {
      console.error('Error fetching quick replies:', error);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchConversations();
    fetchQuickReplies();
    
    // Set up periodic refresh for conversations
    const refreshInterval = setInterval(() => {
      if (!activeConversation) {
        fetchConversations();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [statusFilter, searchTerm]);
  
  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      
      // Set up periodic refresh for messages
      const refreshInterval = setInterval(() => {
        fetchMessages(activeConversation.id);
      }, 10000); // Refresh every 10 seconds
      
      return () => clearInterval(refreshInterval);
    }
  }, [activeConversation]);
  
  // Filter conversations based on search term and status
  const filterConversations = (
    allConversations: Conversation[],
    search: string,
    status: 'all' | 'active' | 'closed'
  ) => {
    return allConversations.filter((conversation) => {
      // Filter by status
      if (status !== 'all' && conversation.status !== status) {
        return false;
      }
      
      // Filter by search term
      if (search.trim() !== '') {
        const searchLower = search.toLowerCase();
        return (
          conversation.customer_email.toLowerCase().includes(searchLower) ||
          conversation.customer_name?.toLowerCase().includes(searchLower) ||
          conversation.last_message?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };
  
  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      setIsSending(true);
      
      // Use our new API endpoint
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage,
          adminId: 'admin', // You can use actual admin ID here
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add message to local state (optimistic update)
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        
        // Update conversation with last message
        const updatedConversation = {
          ...activeConversation,
          last_message: newMessage,
          last_message_time: new Date().toISOString(),
        };
        
        setActiveConversation(updatedConversation);
        
        // Update conversation in the list
        setConversations(conversations.map((convo) =>
          convo.id === activeConversation.id ? updatedConversation : convo
        ));
        
        setFilteredConversations(
          filterConversations(
            conversations.map((convo) =>
              convo.id === activeConversation.id ? updatedConversation : convo
            ),
            searchTerm,
            statusFilter
          )
        );
      }
      
      // Clear message input
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Update conversation status
  const updateConversationStatus = async (status: 'active' | 'closed') => {
    if (!activeConversation) return;
    
    try {
      // Use our new API endpoint
      const response = await fetch('/api/admin/conversations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeConversation.id,
          status,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating conversation: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update local state
      if (data.conversation) {
        setActiveConversation(data.conversation);
        
        // Update conversation in the list
        setConversations(conversations.map((convo) =>
          convo.id === activeConversation.id ? data.conversation : convo
        ));
        
        setFilteredConversations(
          filterConversations(
            conversations.map((convo) =>
              convo.id === activeConversation.id ? data.conversation : convo
            ),
            searchTerm,
            statusFilter
          )
        );
      }
    } catch (error) {
      console.error('Error updating conversation status:', error);
    }
  };
  
  // Use a quick reply
  const insertQuickReply = (content: string) => {
    setNewMessage(content);
  };
  
  // Render timestamp for conversation list
  const renderTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'No messages';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, 'h:mm a');
    } else {
      return format(date, 'MMM d');
    }
  };
  
  // Status icons
  const statusIcon = {
    active: <Clock className="text-yellow-500" size={16} />,
    closed: <Check className="text-green-500" size={16} />,
  };
  
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Customer Chat
            </h1>
            <p className="mt-2 text-white/60">
              Manage customer conversations and provide support
            </p>
          </div>
          
          <Link href="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px]">
          {/* Conversation List */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden md:col-span-1 flex flex-col">
            {/* Filters and Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border-white/10 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
              </div>
              
              <Tabs value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                  <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Inbox className="h-12 w-12 text-white/20 mb-4" />
                  <p className="text-white/60 text-center">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No conversations match your filters'
                      : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {filteredConversations.map((conversation) => (
                    <li key={conversation.id}>
                      <button
                        onClick={() => setActiveConversation(conversation)}
                        className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                          activeConversation?.id === conversation.id ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 mt-1">
                              <User size={16} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white truncate max-w-[160px]">
                                {conversation.customer_name || 'Anonymous'}
                              </h3>
                              <p className="text-xs text-white/60 mb-1">
                                {conversation.customer_email}
                              </p>
                              <p className="text-sm text-white/60 truncate max-w-[180px]">
                                {conversation.last_message || 'No messages yet'}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-white/50 flex flex-col items-end gap-1">
                            <div className="flex items-center">
                              {statusIcon[conversation.status]}
                              <span className="ml-1">
                                {renderTimestamp(conversation.last_message_time)}
                              </span>
                            </div>
                            {conversation.unread_count > 0 && (
                              <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden md:col-span-2 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">
                      {activeConversation.customer_name || 'Anonymous'}
                      <span className="text-white/60 font-normal text-sm ml-2">
                        ({activeConversation.customer_email})
                      </span>
                    </h2>
                    <p className="text-xs text-white/60 flex items-center gap-2">
                      <Calendar size={12} />
                      Started {formatDistanceToNow(new Date(activeConversation.created_at))} ago
                      <span className="flex items-center gap-1 ml-2">
                        {statusIcon[activeConversation.status]}
                        <span className="capitalize">{activeConversation.status}</span>
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {activeConversation.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => updateConversationStatus('closed')}
                      >
                        <Check size={16} className="text-green-500" />
                        Close
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => updateConversationStatus('active')}
                      >
                        <Clock size={16} className="text-yellow-500" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-white/[0.02]" style={{ scrollBehavior: 'smooth' }}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <MessageCircle className="h-12 w-12 text-white/20 mb-4" />
                      <p className="text-white/60 text-center">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        content={msg.content}
                        isAdmin={msg.sender_type === 'admin'}
                        timestamp={new Date(msg.created_at)}
                        isRead={msg.read}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick Replies */}
                {quickReplies.length > 0 && (
                  <div className="border-t border-white/10 p-2 overflow-x-auto whitespace-nowrap">
                    <div className="flex gap-2">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply.id}
                          variant="ghost"
                          size="sm"
                          className="bg-white/5 border border-white/10"
                          onClick={() => insertQuickReply(reply.content)}
                        >
                          {reply.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-white/10 p-4 flex items-center"
                >
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={activeConversation.status === 'closed'}
                    className="flex-1 bg-white/5 border-white/10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="ml-2 bg-primary hover:bg-primary-dark"
                    disabled={!newMessage.trim() || isSending || activeConversation.status === 'closed'}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="bg-white/5 rounded-full p-8 mb-4">
                  <MessageCircle className="h-12 w-12 text-white/20" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
                <p className="text-white/60 text-center max-w-md">
                  Select a conversation from the list on the left to view and respond to customer messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 