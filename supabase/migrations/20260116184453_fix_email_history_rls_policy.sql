/*
  # Fix Email History RLS Policy

  ## Problem
  - The email_history table has RLS enabled
  - Only authenticated users can SELECT from the table
  - The app uses the anon key without authentication
  - Result: All queries return 0 rows even though data exists

  ## Solution
  - Add a SELECT policy for anonymous (unauthenticated) users
  - This allows the app to read email history using the anon key

  ## Changes
  1. Security
    - Add policy "Anonymous users can view all emails" for SELECT operations
    - Allows anon role to read email_history table
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view all emails" ON email_history;

-- Create new policy that allows both authenticated and anonymous users to view emails
CREATE POLICY "Users can view all emails"
  ON email_history
  FOR SELECT
  TO authenticated, anon
  USING (true);
