'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, MessageCircle, Loader2, Info } from 'lucide-react';
import { z } from 'zod';

interface Message {
  id: string;
  sender_type: 'customer' | 'admin';
  content: string;
  created_at: string;
  read: boolean;
}

// Form validation schema
const chatFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  message: z.string().min(1, 'Message cannot be empty'),
});

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    message?: string;
  }>({});
  const [formStep, setFormStep] = useState<'contact' | 'chat'>('contact');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
      await loadExistingConversation();
      
      // If no existing conversation found, create a new one
      if (formStep !== 'chat') {
        // Create a new conversation
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .insert([
            { customer_email: email, customer_name: name, status: 'active' },
          ])
          .select()
          .single();
        
        if (convError) throw convError;
        
        setConversationId(conversation.id);
        
        // Add the first message
        const { data: messageData, error: msgError } = await supabase
          .from('messages')
          .insert([
            {
              conversation_id: conversation.id,
              sender_type: 'customer',
              sender_id: email,
              content: message,
            },
          ])
          .select()
          .single();
        
        if (msgError) throw msgError;
        
        // Update conversation with last message
        await supabase
          .from('conversations')
          .update({
            last_message: message,
            last_message_time: new Date().toISOString(),
            unread_count: 1,
          })
          .eq('id', conversation.id);
        
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
        setUpRealtimeSubscription(conversation.id);
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
      
      // Update conversation with last message
      await supabase
        .from('conversations')
        .update({
          last_message: message,
          last_message_time: new Date().toISOString(),
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
    const subscription = supabase
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
      
    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
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
    if (!email) return;
    
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
      }
      
      return false;
    } catch (error) {
      console.error('Error loading conversation:', error);
      return false;
    }
  };
  
  // Handle opening/closing the chat
  const toggleChat = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // If opening the chat, mark messages as read
    if (newIsOpen && conversationId && unreadCount > 0) {
      markAllAsRead();
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-secondary/90 backdrop-blur-md rounded-2xl shadow-2xl w-[350px] h-[500px] mb-4 overflow-hidden flex flex-col border border-white/10"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-light via-primary to-primary-dark text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Live Chat Support</h3>
                <p className="text-xs opacity-80">We typically reply in a few minutes</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 transition-colors rounded-full p-1 hover:bg-black/20"
              >
                <X size={20} />
              </button>
            </div>
            
            {formStep === 'contact' ? (
              /* Initial Contact Form */
              <div className="flex-1 p-4 flex flex-col">
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
                <div className="flex-1 p-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                  {/* Message date separator */}
                  <div className="text-center mb-4">
                    <span className="px-2 py-1 text-xs text-white/50 bg-white/5 rounded-full">
                      {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  {/* Messages */}
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      content={msg.content}
                      isAdmin={msg.sender_type === 'admin'}
                      timestamp={new Date(msg.created_at)}
                      isRead={msg.read}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-white/10 p-4 bg-white/5 backdrop-blur-md flex items-center gap-2"
                >
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border-white/10 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-primary hover:bg-primary-dark text-white"
                    disabled={!message.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Button with Notification Badge */}
      <div className="relative">
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