/*
  # Create Contact Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `user_id` (uuid) - Reference to the user who submitted the contact form
      - `user_email` (text) - Email address of the user
      - `user_name` (text) - Full name of the user
      - `subject` (text) - Subject/category of the inquiry
      - `message` (text) - The contact message content
      - `priority` (text) - Priority level (normal or urgent)
      - `status` (text) - Status of the submission (pending, in_progress, resolved)
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for authenticated users to insert their own submissions
    - Add policy for authenticated users to view their own submissions
    - Add index on user_id for efficient queries
    - Add index on created_at for sorting

  3. Notes
    - This table stores all contact form submissions from users
    - Users can only see and create their own submissions
    - Admin access would need separate policies (not included in this migration)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_email text NOT NULL,
  user_name text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own contact submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id 
  ON contact_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);