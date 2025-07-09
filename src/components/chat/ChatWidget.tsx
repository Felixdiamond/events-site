'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, MessageCircle, Loader2, Info, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Message {
  id: string;
  sender_type: 'customer' | 'admin';
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatWidgetProps {
  onChatStateChange?: (isOpen: boolean) => void;
}

// Form validation schema
const chatFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  message: z.string().min(1, 'Message cannot be empty'),
});

export function ChatWidget({ onChatStateChange }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    message?: string;
  }>({});
  const [formStep, setFormStep] = useState<'contact' | 'chat'>('contact');
  const [unreadCount, setUnreadCount] = useState(0);
  const [quickReplies, setQuickReplies] = useState<{ id: string; title: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  // Check for unread messages periodically
  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!email || !conversationId) return;
      
      try {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'admin')
          .eq('read', false);
        
        if (data) {
          setUnreadCount(data.length);
        }
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };
    
    if (conversationId && !isOpen) {
      const interval = setInterval(checkUnreadMessages, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [conversationId, isOpen, email]);

  // Prevent page scrolling when chat is open on mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isOpen && isMobile) {
        // Check if the touch is within the chat container
        if (chatContainerRef.current && !chatContainerRef.current.contains(e.target as Node)) {
          e.preventDefault();
        }
      }
    };

    // Only add the listener when the chat is open on mobile
    if (isOpen && isMobile) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, isMobile]);
  
  // Load existing conversation from local storage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('chatEmail');
    const savedName = localStorage.getItem('chatName');
    const savedConversationId = localStorage.getItem('chatConversationId');
    
    if (savedEmail && savedName) {
      setEmail(savedEmail);
      setName(savedName);
      
      if (savedConversationId) {
        setConversationId(savedConversationId);
      }
      
      // Try to load the conversation after setting email/name
      loadExistingConversation().then((success) => {
        if (success) {
          console.log('Successfully loaded conversation from storage');
        }
      });
    }
  }, []);
  
  // Save chat data to local storage when it changes
  useEffect(() => {
    if (email && name && formStep === 'chat') {
      localStorage.setItem('chatEmail', email);
      localStorage.setItem('chatName', name);
      
      if (conversationId) {
        localStorage.setItem('chatConversationId', conversationId);
      }
    }
  }, [email, name, formStep, conversationId]);
  
  // Start a new conversation
  const startConversation = async () => {
    if (!email) {
      console.error("No user email available");
      return;
    }

    try {
      // Create a new conversation
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          customer_email: email,
          customer_name: name || 'Anonymous User',
          status: 'active',
          last_activity: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting conversation:', error);
        return;
      }

      // Store the conversation ID
      setConversationId(conversation.id);
      localStorage.setItem('chatConversationId', conversation.id);
      
      return conversation.id;
    } catch (error) {
      console.error('Error in startConversation:', error);
      return null;
    }
  };

  // Handle form submission for initial contact info
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      chatFormSchema.parse({ email, name, message });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          name: fieldErrors.name?.[0],
          message: fieldErrors.message?.[0],
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Try loading existing conversation first
      const existingConversationLoaded = await loadExistingConversation();
      
      // If no existing conversation found, create a new one
      if (!existingConversationLoaded) {
        // Create a new conversation
        const conversationId = await startConversation();
        
        if (!conversationId) {
          console.error('Failed to start conversation');
          return;
        }
        
        // Add the first message
        const { data: messageData, error: msgError } = await supabase
          .from('messages')
          .insert([
            {
              conversation_id: conversationId,
              sender_type: 'customer',
              sender_id: email,
              content: message,
            },
          ])
          .select()
          .single();
        
        if (msgError) throw msgError;
        
        // Update conversation with last message and activity timestamp
        await supabase
          .from('conversations')
          .update({
            last_message: message,
            last_message_time: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            unread_count: 1,
          })
          .eq('id', conversationId);
        
        // Add message to state
        setMessages([
          {
            id: messageData.id,
            sender_type: 'customer',
            content: message,
            created_at: messageData.created_at,
            read: false,
          },
        ]);
        
        // Clear message input
        setMessage('');
        
        // Move to chat interface
        setFormStep('chat');
        
        // Set up realtime subscription for this conversation
        setUpRealtimeSubscription(conversationId);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle sending a message in an existing conversation
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !conversationId) return;
    
    try {
      setIsSubmitting(true);
      
      // Add message to database
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_type: 'customer',
            sender_id: email,
            content: message,
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update conversation with last message and activity timestamp
      await supabase
        .from('conversations')
        .update({
          last_message: message,
          last_message_time: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          unread_count: 1,
        })
        .eq('id', conversationId);
      
      // Add to messages state (optimistic update)
      setMessages((prev) => [
        ...prev,
        {
          id: messageData.id,
          sender_type: 'customer',
          content: message,
          created_at: messageData.created_at,
          read: false,
        },
      ]);
      
      // Clear message input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Set up realtime subscription to listen for new messages
  const setUpRealtimeSubscription = (convoId: string) => {
    // Create subscription for new messages in this conversation
    const messagesSubscription = supabase
      .channel(`conversation:${convoId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convoId}`,
        },
        (payload) => {
          // Only add if it's from admin (as we've already added customer messages)
          if (payload.new.sender_type === 'admin') {
            setMessages((prev) => [
              ...prev,
              payload.new as Message,
            ]);
            
            // Mark as read if chat is open
            if (isOpen) {
              markMessageAsRead(payload.new.id);
            } else {
              // Increment unread count
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      )
      .subscribe();
      
    // Also listen for updates to message read status
    const readStatusSubscription = supabase
      .channel(`read-status:${convoId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convoId}`,
        },
        (payload) => {
          // Update the read status of messages
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? { ...msg, read: payload.new.read } : msg
            )
          );
        }
      )
      .subscribe();
      
    // Clean up subscriptions when component unmounts
    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(readStatusSubscription);
    };
  };
  
  // Mark a message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Mark all messages as read when opening the chat
  const markAllAsRead = async () => {
    if (!conversationId) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'admin')
        .eq('read', false);
      
      // Update message state to reflect read status
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          read: msg.sender_type === 'admin' ? true : msg.read,
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      // Update conversation
      await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  // Load existing conversation if available
  const loadExistingConversation = async () => {
    if (!email) return false;
    
    try {
      // Check for existing active conversation
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('customer_email', email)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (conversations && conversations.length > 0) {
        const conversation = conversations[0];
        setConversationId(conversation.id);
        
        // Update local storage with conversation ID
        localStorage.setItem('chatConversationId', conversation.id);
        
        // Fetch messages for this conversation
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });
        
        if (msgError) throw msgError;
        
        if (messages) {
          setMessages(messages);
          setFormStep('chat');
          
          // Count unread messages
          const unreadMessages = messages.filter(
            (msg) => msg.sender_type === 'admin' && !msg.read
          );
          setUnreadCount(unreadMessages.length);
          
          // Set up realtime subscription
          setUpRealtimeSubscription(conversation.id);
          
          return true;
        }
      } else {
        // Check if there's a saved conversation ID that is now closed
        const savedId = localStorage.getItem('chatConversationId');
        if (savedId) {
          // If the conversation exists but is closed, clear it from storage
          const { data } = await supabase
            .from('conversations')
            .select('status, closed_reason')
            .eq('id', savedId)
            .single();
            
          if (data && data.status === 'closed') {
            // Conversation was closed by admin, clear it and reset
            localStorage.removeItem('chatConversationId');
            resetChat();
            
            // Show a message about the closed chat
            let closedMessage = 'Your previous chat has been closed. Please start a new conversation if you need further assistance.';
            
            // Add reason if available
            if (data.closed_reason) {
              closedMessage = `Your previous chat has been closed: ${data.closed_reason}. Please start a new conversation if you need further assistance.`;
            }
            
            alert(closedMessage);
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error loading conversation:', error);
      return false;
    }
  };
  
  // Handle opening/closing the chat
  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // If opening the chat, mark messages as read
    if (newState && conversationId && unreadCount > 0) {
      markAllAsRead();
    }
    
    // Notify parent about chat state change if callback is provided
    if (onChatStateChange) {
      onChatStateChange(newState);
    }
  };

  // Calculate chat window dimensions based on screen size
  const getChatWindowSize = () => {
    if (isMobile) {
      return {
        width: '100vw',
        height: '100vh',
        bottom: 0,
        right: 0,
        borderRadius: '0px'
      };
    }
    
    return {
      width: '350px',
      height: '500px',
      bottom: '80px',
      right: '20px',
      borderRadius: '16px'
    };
  };
  
  // Handle typing indicator
  const handleTyping = () => {
    setIsTyping(message.length > 0);
  };

  // Fetch quick replies on chat open - but only once
  useEffect(() => {
    if (isOpen && formStep === 'chat' && quickReplies.length === 0) {
      const fetchQuickReplies = async () => {
        try {
          const response = await fetch('/api/chat/quick-replies');
          if (response.ok) {
            const data = await response.json();
            if (data.quickReplies) {
              setQuickReplies(data.quickReplies);
            }
          }
        } catch (error) {
          console.error('Error fetching quick replies:', error);
        }
      };
      
      fetchQuickReplies();
    }
  }, [isOpen, formStep, quickReplies.length]);

  // Reset the chat widget state
  const resetChat = () => {
    // Don't clear email/name to maintain user identity
    setConversationId(null);
    setMessages([]);
    setFormStep('contact');
    setMessage('');
    setUnreadCount(0);
  };
  
  // Clear saved chat data completely
  const clearChatData = () => {
    localStorage.removeItem('chatEmail');
    localStorage.removeItem('chatName');
    localStorage.removeItem('chatConversationId');
    setEmail('');
    setName('');
    resetChat();
  };

  // Prevent scroll chaining on desktop (mouse wheel)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
      // Prevent scrolling the main page when at the top or bottom
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`bg-secondary/90 backdrop-blur-md shadow-2xl flex flex-col border border-white/10 h-full`}
            style={{
              position: 'fixed',
              ...getChatWindowSize(),
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-light via-primary to-primary-dark text-white p-4 flex justify-between items-center h-16 min-h-16 max-h-16">
              <div>
                <h3 className="font-bold">Live Chat Support</h3>
                <p className="text-xs opacity-80">We typically reply in a few minutes</p>
              </div>
              <div className="flex items-center gap-2">
                {formStep === 'chat' && (
                  <button
                    onClick={clearChatData}
                    className="text-white hover:text-white/80 transition-colors rounded-full p-1 hover:bg-black/20"
                    title="Reset Chat"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors rounded-full p-1 hover:bg-black/20"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {formStep === 'contact' ? (
              /* Initial Contact Form */
              <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Info className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                    <p className="text-sm text-white/70">
                      Please provide your details to start the conversation. Our team will respond as soon as possible.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleStartChat} className="space-y-4 flex-1">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-white/70 mb-1"
                    >
                      How can we help you?
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>
                  
                  <div className="flex-1 flex items-end">
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        'Start Conversation'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Chat Interface */
              <>
                <div 
                  className="p-4 overflow-y-auto" 
                  style={{ 
                    height: 'calc(500px - 64px - 64px)',
                    scrollBehavior: 'smooth',
                    overscrollBehavior: 'contain' // Prevents scroll chaining
                  }}
                  onWheel={handleWheel}
                >
                  {/* Message date separator */}
                  <div className="text-center mb-4">
                    <span className="px-2 py-1 text-xs text-white/50 bg-white/5 rounded-full">
                      {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  {/* Messages */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <MessageBubble
                        content={msg.content}
                        isAdmin={msg.sender_type === 'admin'}
                        timestamp={new Date(msg.created_at)}
                        isRead={msg.read}
                        contextType="user"
                      />
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="p-3 border-t border-white/10 h-16 min-h-16 max-h-16 flex items-center">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type your message..."
                      className="min-h-[42px] max-h-[120px] bg-white/5 border-white/10 resize-none"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-primary hover:bg-primary-dark"
                      disabled={isSubmitting || !message.trim()}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                    </Button>
                  </form>
                  
                  {/* Quick replies */}
                  {quickReplies.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
                      {quickReplies.map(reply => (
                        <Button
                          key={reply.id}
                          variant="ghost"
                          size="sm"
                          className="bg-white/5 border border-white/10 flex-shrink-0"
                          onClick={() => setMessage(reply.content)}
                        >
                          {reply.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Button with Notification Badge - Fixed position based on screen size */}
      <div className={`fixed ${isMobile ? 'bottom-5 right-5' : 'bottom-5 right-5'}`}>
        <Button 
          onClick={toggleChat}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary-light via-primary to-primary-dark hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageCircle size={24} />
          )}
        </Button>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          >
            {unreadCount}
          </motion.div>
        )}
      </div>
    </div>
  );
}