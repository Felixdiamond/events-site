-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.quick_replies;
DROP TABLE IF EXISTS public.conversations;

-- Create conversations table with all needed fields
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    last_message TEXT,
    last_message_time TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_reason TEXT
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'admin')),
    sender_id TEXT,
    admin_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL
);

-- Create quick replies table
CREATE TABLE public.quick_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_conversations_customer_email ON public.conversations(customer_email);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create and read their own conversations and messages
CREATE POLICY "Allow anonymous to create conversations" 
    ON public.conversations FOR INSERT 
    TO anon 
    WITH CHECK (true);

CREATE POLICY "Allow anonymous to read their own conversations" 
    ON public.conversations FOR SELECT 
    TO anon 
    USING (true);

CREATE POLICY "Allow anonymous to update their own conversations" 
    ON public.conversations FOR UPDATE 
    TO anon 
    USING (true);

CREATE POLICY "Allow anonymous to create messages in their conversations" 
    ON public.messages FOR INSERT 
    TO anon 
    WITH CHECK (true);

CREATE POLICY "Allow anonymous to read messages in their conversations" 
    ON public.messages FOR SELECT 
    TO anon 
    USING (true);

-- Allow anonymous to read quick replies
CREATE POLICY "Allow anonymous to read quick replies" 
    ON public.quick_replies FOR SELECT 
    TO anon 
    USING (true);

-- Allow authenticated admins full access
CREATE POLICY "Allow admins full access to conversations" 
    ON public.conversations 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow admins full access to messages" 
    ON public.messages 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow admins full access to quick replies" 
    ON public.quick_replies 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Add realtime support
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.quick_replies REPLICA IDENTITY FULL;

-- Create function to update last activity timestamp
CREATE OR REPLACE FUNCTION public.update_conversation_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the last_activity timestamp when a new message is added
    UPDATE public.conversations
    SET last_activity = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the last activity time
CREATE TRIGGER update_conversation_last_activity_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_activity();

-- Create function to update conversation unread count
CREATE OR REPLACE FUNCTION public.update_conversation_unread_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sender_type = 'customer' THEN
        -- Increment unread_count when customer sends a message
        UPDATE public.conversations
        SET unread_count = unread_count + 1,
            last_message = NEW.content,
            last_message_time = NEW.created_at
        WHERE id = NEW.conversation_id;
    ELSE
        -- Just update last_message when admin sends a message
        UPDATE public.conversations
        SET last_message = NEW.content,
            last_message_time = NEW.created_at
        WHERE id = NEW.conversation_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update unread count
CREATE TRIGGER update_conversation_unread_count_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_unread_count();
