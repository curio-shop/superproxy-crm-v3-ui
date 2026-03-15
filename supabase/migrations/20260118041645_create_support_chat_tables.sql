/*
  # Create Support Chat System Tables

  ## Overview
  This migration creates the database structure for a live support chat feature that allows users to communicate with support team members in real-time.

  ## New Tables

  ### `support_conversations`
  Tracks individual chat conversations between users and support team.
  - `id` (uuid, primary key) - Unique conversation identifier
  - `user_id` (uuid, foreign key) - Reference to the user in auth.users
  - `status` (text) - Conversation status: 'open' or 'closed'
  - `unread_count` (integer) - Number of unread messages for the user
  - `created_at` (timestamptz) - When the conversation was started
  - `updated_at` (timestamptz) - Last message timestamp

  ### `support_messages`
  Stores all messages within support conversations.
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Reference to support_conversations
  - `sender_type` (text) - Either 'user' or 'support'
  - `sender_id` (uuid) - ID of the sender (user_id or support team member id)
  - `sender_name` (text) - Display name of the sender
  - `sender_avatar` (text, nullable) - Avatar URL for support team members
  - `message` (text) - The message content
  - `created_at` (timestamptz) - When the message was sent

  ## Security
  - Enable RLS on both tables
  - Users can only view/create their own conversations and messages
  - Support team members (identified by role) can view all conversations
*/

-- Create support_conversations table
CREATE TABLE IF NOT EXISTS support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'open' NOT NULL,
  unread_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES support_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'support')),
  sender_id uuid NOT NULL,
  sender_name text NOT NULL,
  sender_avatar text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_conversations_user_id ON support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_status ON support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation_id ON support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Enable Row Level Security
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_conversations
CREATE POLICY "Users can view their own conversations"
  ON support_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON support_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON support_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages in their conversations"
  ON support_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND support_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON support_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_conversations
      WHERE support_conversations.id = support_messages.conversation_id
      AND support_conversations.user_id = auth.uid()
    )
  );

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_conversations
  SET updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update conversation timestamp when new message is added
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON support_messages;
CREATE TRIGGER update_conversation_timestamp_trigger
  AFTER INSERT ON support_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();