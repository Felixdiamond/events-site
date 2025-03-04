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
  Inbox,
  Ban
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase-client';

interface Conversation {
  id: string;
  customer_email: string;
  customer_name?: string;
  status: 'active' | 'closed';
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  closed_reason?: string;
  last_activity?: string;
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
  const [conversationDetails, setConversationDetails] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setConversations(prevConversations => 
            prevConversations.map((convo) =>
              convo.id === conversationId ? { ...convo, unread_count: 0 } : convo
            )
          );
          setFilteredConversations(prevFiltered => 
            filterConversations(
              prevFiltered.map((convo) =>
                convo.id === conversationId ? { ...convo, unread_count: 0 } : convo
              ),
              searchTerm,
              statusFilter
            )
          );
        }
      }
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
  
  // Set up realtime subscription for conversations
  useEffect(() => {
    // Subscribe to all conversation changes
    const conversationChannel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            // New conversation
            setConversations(prev => [payload.new as Conversation, ...prev]);
            setFilteredConversations(filterConversations(
              [payload.new as Conversation, ...conversations],
              searchTerm,
              statusFilter
            ));
          } else if (payload.eventType === 'UPDATE') {
            const updatedConvo = payload.new as Conversation;
            
            // Update conversations list with the updated conversation
            setConversations(prev => prev.map(convo => 
              convo.id === updatedConvo.id ? updatedConvo : convo
            ));
            
            // Only update filtered conversations if it should still be in the list
            // based on the current filter
            if (
              statusFilter === 'all' || 
              updatedConvo.status === statusFilter
            ) {
              setFilteredConversations(prev => prev.map(convo => 
                convo.id === updatedConvo.id ? updatedConvo : convo
              ));
            } else {
              // Remove from filtered list if it no longer matches the filter
              setFilteredConversations(prev => 
                prev.filter(convo => convo.id !== updatedConvo.id)
              );
            }
            
            // If this is the active conversation, update it
            if (activeConversation && activeConversation.id === updatedConvo.id) {
              // If the conversation was closed, clear the active conversation
              if (updatedConvo.status === 'closed' && activeConversation.status === 'active') {
                setActiveConversation(null);
                setMessages([]);
              } else {
                setActiveConversation(updatedConvo);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            // Deleted conversation
            setConversations(prev => prev.filter(convo => convo.id !== payload.old.id));
            setFilteredConversations(prev => prev.filter(convo => convo.id !== payload.old.id));
            
            // If this was the active conversation, clear it
            if (activeConversation && activeConversation.id === payload.old.id) {
              setActiveConversation(null);
              setMessages([]);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationChannel);
    };
  }, [conversations, searchTerm, statusFilter, activeConversation]);
  
  // Set up realtime subscription for messages when a conversation is active
  useEffect(() => {
    if (!activeConversation) return;
    
    // Fetch initial messages
    fetchMessages(activeConversation.id);
    
    // Subscribe to message changes for this conversation
    const messagesChannel = supabase
      .channel(`messages-${activeConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          // Add new message to the chat
          setMessages(prev => [...prev, payload.new as Message]);
          
          // If it's a customer message, mark as read
          if (payload.new.sender_type === 'customer') {
            // Mark the message as read via API
            fetch('/api/admin/messages/read', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messageId: payload.new.id,
              }),
            }).catch(error => {
              console.error('Error marking message as read:', error);
            });
            
            // Update conversation in list to show it's been read
            if (activeConversation) {
              const updatedConvo = {
                ...activeConversation,
                unread_count: 0,
                last_message: payload.new.content,
                last_message_time: payload.new.created_at,
              };
              
              setActiveConversation(updatedConvo);
              
              setConversations(conversations.map((convo) =>
                convo.id === updatedConvo.id ? updatedConvo : convo
              ));
              
              setFilteredConversations(
                filterConversations(
                  conversations.map((convo) =>
                    convo.id === updatedConvo.id ? updatedConvo : convo
                  ),
                  searchTerm,
                  statusFilter
                )
              );
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [activeConversation]);
  
  // Initial data fetch - only once
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch conversations and quick replies only once on initial load
    Promise.all([
      fetchConversations(),
      fetchQuickReplies()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []); // Empty dependency array - run once
  
  // Apply filters when search term or status filter changes
  useEffect(() => {
    setFilteredConversations(
      filterConversations(conversations, searchTerm, statusFilter)
    );
  }, [searchTerm, statusFilter, conversations]);
  
  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation, fetchMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  
  // Format conversation details
  useEffect(() => {
    if (activeConversation) {
      // Format the conversation details
      const created = new Date(activeConversation.created_at);
      let formattedDetails = `Started: ${format(created, 'MMM d, yyyy h:mm a')}`;
      
      if (activeConversation.status === 'closed' && activeConversation.closed_at) {
        const closed = new Date(activeConversation.closed_at);
        formattedDetails += ` • Closed: ${format(closed, 'MMM d, yyyy h:mm a')}`;
        
        if (activeConversation.closed_reason) {
          formattedDetails += ` • Reason: ${activeConversation.closed_reason}`;
        }
      }
      
      setConversationDetails(formattedDetails);
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
        // Update the conversation in our lists
        const updatedConversations = conversations.map((convo) =>
          convo.id === activeConversation.id ? data.conversation : convo
        );
        
        setConversations(updatedConversations);
        
        // Update filtered list based on current filters
        setFilteredConversations(
          filterConversations(
            updatedConversations,
            searchTerm,
            statusFilter
          )
        );
        
        // If closing, clear the active conversation
        if (status === 'closed') {
          setActiveConversation(null);
          setMessages([]);
          
          // Force refresh the status filters
          if (statusFilter === 'active') {
            // Remove the closed conversation from the filtered list
            setFilteredConversations(
              filteredConversations.filter(
                (convo) => convo.id !== activeConversation.id
              )
            );
          }
        } else {
          // If updating to active, update the active conversation
          setActiveConversation(data.conversation);
        }
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
                  className="bg-white/5 border border-white/10 pr-10"
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
                  <p className="text-white/60 text-center mt-4">
                    Inactive conversations are automatically closed after 1 hour of inactivity.
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
                      {conversationDetails}
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
                <div 
                  ref={messageContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-secondary/30"
                >
                  <div className="flex flex-col space-y-4 min-h-full">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender_type === 'admin'
                                ? 'bg-primary text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <div className="text-sm font-semibold mb-1">
                              {message.sender_type === 'admin' ? 'Support Agent' : activeConversation?.customer_name}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {format(new Date(message.created_at), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/60">
                        <MessageCircle size={48} className="mb-2 opacity-40" />
                        <p>No messages yet</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex justify-between items-center px-4 py-2 border-t border-white/5">
                  <div className="flex-1">
                    <div className="text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        {statusIcon[activeConversation.status]}
                        <span className="capitalize">{activeConversation.status}</span>
                      </span>
                    </div>
                  </div>
                  {activeConversation.status === 'active' && (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-white/60">
                        Send a message
                      </span>
                    </div>
                  )}
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
                
                {/* Close Chat Button */}
                {activeConversation && activeConversation.status === 'active' && (
                  <div className="mt-4">
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to close this conversation? The user will be notified and will need to start a new chat.')) {
                          updateConversationStatus('closed');
                        }
                      }}
                    >
                      <Ban size={16} />
                      Close Conversation
                    </Button>
                  </div>
                )}
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
                <p className="text-white/60 text-center mt-4">
                  Inactive conversations are automatically closed after 1 hour of inactivity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}