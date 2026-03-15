/*
  # Add Call Type Variants

  1. Changes
    - Update call_type column to support various call types
    - Add check constraint for valid call types
    - Types: cold_call, follow_up, re_engagement, payment_reminder, deal_closing

  2. Notes
    - Using safe pattern with IF EXISTS checks
    - Provides meaningful call type categorization
*/

DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'call_history' AND constraint_name = 'call_history_call_type_check'
  ) THEN
    ALTER TABLE call_history DROP CONSTRAINT call_history_call_type_check;
  END IF;
END $$;

-- Add check constraint for valid call types
ALTER TABLE call_history 
ADD CONSTRAINT call_history_call_type_check 
CHECK (call_type IN ('cold_call', 'follow_up', 're_engagement', 'payment_reminder', 'deal_closing'));

-- Update default value to cold_call
ALTER TABLE call_history 
ALTER COLUMN call_type SET DEFAULT 'cold_call';