import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from './MessageBubble';
import { Send, X, MessageCircle, Loader2, RefreshCw, Info, Plus } from 'lucide-react';

interface Message {
  id: string;
  sender_type: 'customer' | 'admin';
  content: string;
  created_at: string;
  read: boolean;
}

interface QuickReply {
  id: string;
  title: string;
  content: string;
}

export default function ChatWidgetV2() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [formStep, setFormStep] = useState<'contact' | 'chat'>('contact');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // User State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Chat State
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStatus, setConversationStatus] = useState<'active' | 'closed' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase.channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Only add if it's from admin (as we've already added customer messages)
          if (payload.new.sender_type === 'admin') {
            setMessages((prev) => [
              ...prev,
              {
                id: payload.new.id,
                sender_type: payload.new.sender_type,
                content: payload.new.content,
                created_at: payload.new.created_at,
                read: payload.new.read,
              } as Message,
            ]);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom on new message or when opening chat
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, formStep]);

  // Fetch quick replies
  useEffect(() => {
    if (isOpen && formStep === 'chat' && quickReplies.length === 0) {
      fetch('/api/chat/quick-replies')
        .then(res => res.json())
        .then(data => setQuickReplies(data || []));
    }
  }, [isOpen, formStep, quickReplies.length]);

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('chatName');
    const savedEmail = localStorage.getItem('chatEmail');
    const savedConversationId = localStorage.getItem('chatConversationId');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedConversationId) {
      setConversationId(savedConversationId);
      setFormStep('chat');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (name) localStorage.setItem('chatName', name);
    if (email) localStorage.setItem('chatEmail', email);
    if (conversationId) localStorage.setItem('chatConversationId', conversationId);
  }, [name, email, conversationId]);

  // Fetch messages and status for conversation
  useEffect(() => {
    if (!conversationId) {
      setConversationStatus(null);
      return;
    }
    // Fetch messages
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });
    // Fetch conversation status
    supabase
      .from('conversations')
      .select('status')
      .eq('id', conversationId)
      .single()
      .then(({ data }) => {
        if (data && data.status) setConversationStatus(data.status);
      });
  }, [conversationId]);

  // Lock background scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // --- Handlers ---
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Name required';
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = 'Valid email required';
    if (!message.trim()) errs.message = 'Message required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setIsSubmitting(true);
    // Try new API endpoint for chat creation and admin notification
    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name, customerEmail: email, firstMessage: message }),
      });
      if (res.ok) {
        const data = await res.json();
        const convo = data.conversation;
        setConversationId(convo.id);
        // Insert first message (already in conversation, but keep for consistency)
        const { data: msg, error: msgErr } = await supabase
          .from('messages')
          .insert({ conversation_id: convo.id, sender_type: 'customer', sender_id: email, content: message })
          .select()
          .single();
        if (msgErr || !msg) {
          setIsSubmitting(false);
          setErrors({ message: 'Could not send message. Try again.' });
          return;
        }
        setMessages([msg]);
        setMessage('');
        setFormStep('chat');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      // Fallback to old method if needed
      console.error('Failed to use admin chat API, falling back:', err);
    }
    // Fallback: direct supabase insert (no email notification)
    const { data: convo, error: convoErr } = await supabase
      .from('conversations')
      .insert({ customer_email: email, customer_name: name, status: 'active', last_activity: new Date().toISOString() })
      .select()
      .single();
    if (convoErr || !convo) {
      setIsSubmitting(false);
      setErrors({ message: 'Could not start chat. Try again.' });
      return;
    }
    setConversationId(convo.id);
    // Send first message
    const { data: msg, error: msgErr } = await supabase
      .from('messages')
      .insert({ conversation_id: convo.id, sender_type: 'customer', sender_id: email, content: message })
      .select()
      .single();
    if (msgErr || !msg) {
      setIsSubmitting(false);
      setErrors({ message: 'Could not send message. Try again.' });
      return;
    }
    setMessages([msg]);
    setMessage('');
    setFormStep('chat');
    setIsSubmitting(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;
    setIsSubmitting(true);
    const { data: msg, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_type: 'customer', sender_id: email, content: message })
      .select()
      .single();
    if (!error && msg) {
      setMessages(prev => [...prev, msg]);
      setMessage('');
    }
    setIsSubmitting(false);
  };

  const handleQuickReply = (content: string) => setMessage(content);

  // Handler to start a new chat
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setFormStep('contact');
    setMessage('');
    setConversationStatus(null);
    localStorage.removeItem('chatConversationId');
  };

  // --- UI ---
  const chatHeight = isMobile ? '100vh' : '500px';
  const chatWidth = isMobile ? '100vw' : '370px';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-secondary/90 backdrop-blur-lg shadow-2xl border border-white/10 flex flex-col"
            style={{
              width: chatWidth,
              height: chatHeight,
              borderRadius: isMobile ? 0 : 18,
              position: 'fixed',
              bottom: isMobile ? 0 : 20,
              right: isMobile ? 0 : 20,
              overflow: 'hidden',
            }}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-light via-primary to-primary-dark text-white">
              <div>
                <h3 className="font-bold text-lg">Live Chat</h3>
                <p className="text-xs opacity-80">We reply in a few minutes</p>
              </div>
              <div className="flex items-center gap-2">
                {formStep === 'chat' && conversationStatus === 'closed' && (
                  <Button onClick={handleNewChat} variant="secondary" size="sm" className="flex items-center gap-1 px-3 py-1 text-xs font-semibold border border-white/10" aria-label="Start new chat">
                    <Plus size={16} className="mr-1" /> New Chat
                  </Button>
                )}
                <button onClick={handleClose} className="rounded-full p-1 hover:bg-black/20 transition-colors" aria-label="Close chat">
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Main */}
            <div className="flex-1 flex flex-col min-h-0">
              {formStep === 'contact' ? (
                <form onSubmit={handleStartChat} className="flex flex-col gap-3 p-4 flex-1 justify-center">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-2 flex items-start gap-2">
                    <Info className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-sm text-white/70">Please provide your details to start the conversation.</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  <Textarea
                    placeholder="How can we help you?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {(errors.name || errors.email || errors.message) && (
                    <div className="text-xs text-red-500">{errors.name || errors.email || errors.message}</div>
                  )}
                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Start Chat'}
                  </Button>
                </form>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    {messages.length === 0 && (
                      <div className="text-center text-white/60 text-sm mt-8">No messages yet.</div>
                    )}
                    {messages.map(msg => (
                      <MessageBubble
                        key={msg.id}
                        content={msg.content}
                        isAdmin={msg.sender_type === 'admin'}
                        timestamp={new Date(msg.created_at)}
                        isRead={msg.read}
                        contextType="user"
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 p-3 border-t border-white/10 bg-secondary/80">
                    <Textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={conversationStatus === 'closed' ? 'This conversation is closed.' : 'Type your message...'}
                      className="min-h-[42px] max-h-[120px] bg-white/5 border-white/10 resize-none"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey && conversationStatus !== 'closed') {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      disabled={conversationStatus === 'closed'}
                    />
                    <Button type="submit" size="icon" className="bg-primary hover:bg-primary-dark" disabled={isSubmitting || !message.trim() || conversationStatus === 'closed'} aria-label="Send message">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                    </Button>
                  </form>
                  {conversationStatus === 'closed' && (
                    <div className="text-xs text-orange-400 px-4 pb-2">This conversation is closed. Please start a new chat to continue.</div>
                  )}
                  {/* Quick Replies */}
                  {quickReplies.length > 0 && (
                    <div className="flex gap-2 px-3 pb-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
                      {quickReplies.map(reply => (
                        <Button key={reply.id} variant="ghost" size="sm" className="bg-white/5 border border-white/10 flex-shrink-0" onClick={() => handleQuickReply(reply.content)}>
                          {reply.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Chat Button - only show when popup is closed */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5">
          <Button
            onClick={handleOpen}
            className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary-light via-primary to-primary-dark hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </Button>
          {/* Notification Badge */}
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
} 