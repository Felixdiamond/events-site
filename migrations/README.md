# Chat System Schema Update

This directory contains SQL migration scripts for updating the database schema.

## How to apply the chat system schema

1. Connect to your Supabase project
2. Open the SQL Editor
3. Copy the contents of `chat-system-schema.sql` and paste it into the SQL Editor
4. Run the script

## What this migration does

The `chat-system-schema.sql` script will:

1. Drop and recreate the `conversations`, `messages`, and `quick_replies` tables
2. Set up proper relationships between tables
3. Add indexes for better performance
4. Set up Row Level Security (RLS) policies for secure access
5. Add Postgres triggers to:
   - Automatically update the conversation's `last_activity` timestamp when a message is added
   - Automatically update the conversation's `unread_count` and `last_message` fields

## New Fields Added

The updated schema includes new fields:
- `conversations.last_activity`: Tracks when the last activity occurred in a conversation (for auto-closing)
- `conversations.closed_at`: Records when a conversation was closed
- `conversations.closed_reason`: Stores the reason a conversation was closed (e.g., "Auto-closed due to inactivity")

## Data Loss Warning

Running this script will delete all existing chat data. Only run this in development or when you're prepared to lose existing chat history.
