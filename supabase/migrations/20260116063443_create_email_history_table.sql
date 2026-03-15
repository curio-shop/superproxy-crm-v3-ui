/*
  # Create Email History Table

  ## Overview
  This migration creates the email tracking system for outgoing emails with delivery status tracking.

  ## New Tables

  ### `email_history`
  - `id` (uuid, primary key) - Unique identifier for each email
  - `workspace_id` (uuid, nullable) - References workspaces table
  - `contact_id` (uuid, nullable) - References contacts table
  - `user_name` (text) - Name of the sender
  - `user_email` (text) - Email address of the sender
  - `recipient_name` (text) - Name of the recipient
  - `recipient_email` (text) - Email address of the recipient
  - `cc_recipients` (text array) - CC email addresses
  - `subject` (text) - Email subject line
  - `body` (text) - Email body content
  - `status` (text) - Status: sent, delivered, bounced
  - `reference_type` (text, nullable) - Type of reference: quote, invoice, empty
  - `reference_id` (text, nullable) - ID of referenced document
  - `reference_name` (text, nullable) - Name of referenced document
  - `attachment_name` (text, nullable) - Name of attached file
  - `attachment_size` (text, nullable) - Size of attached file
  - `sent_at` (timestamptz) - When email was sent
  - `delivered_at` (timestamptz, nullable) - When email was delivered
  - `bounced_at` (timestamptz, nullable) - When email bounced
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Table Modifications

  ### `contacts` table
  - Add `last_email_sent_at` (timestamptz, nullable) - Track last email interaction

  ## Security

  1. Enable RLS on email_history table
  2. Allow authenticated users to view all emails
  3. Allow authenticated users to create, update emails
  4. Prevent deletion of email history (audit trail)

  ## Important Notes

  - Status tracking starts with sent/delivered/bounced
  - Designed for outgoing emails only
  - Can be extended for future Gmail integration
*/

-- Create email_history table
CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  cc_recipients text[] DEFAULT '{}',
  subject text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'sent',
  reference_type text,
  reference_id text,
  reference_name text,
  attachment_name text,
  attachment_size text,
  sent_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  bounced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add last_email_sent_at to contacts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'last_email_sent_at'
  ) THEN
    ALTER TABLE contacts ADD COLUMN last_email_sent_at timestamptz;
  END IF;
END $$;

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_email_history_contact_id ON email_history(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_history_workspace_id ON email_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_email_history_status ON email_history(status);
CREATE INDEX IF NOT EXISTS idx_email_history_sent_at ON email_history(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_last_email_sent_at ON contacts(last_email_sent_at DESC);

-- Enable Row Level Security
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_history table
CREATE POLICY "Authenticated users can view all emails"
  ON email_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create emails"
  ON email_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update emails"
  ON email_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Note: No DELETE policy - email history should be preserved for audit trail
