/*
  # Enhance Call History Table

  1. Changes
    - Add call_type column (outbound/inbound)
    - Add status column (completed/missed/cancelled)
    - Add transcript column for call transcripts
    - Add sentiment column (positive/neutral/negative)
    - Add next_action column for follow-up actions

  2. Notes
    - Using IF NOT EXISTS pattern to safely add columns
    - All new columns have sensible defaults
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_history' AND column_name = 'call_type'
  ) THEN
    ALTER TABLE call_history ADD COLUMN call_type text DEFAULT 'outbound';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_history' AND column_name = 'status'
  ) THEN
    ALTER TABLE call_history ADD COLUMN status text DEFAULT 'completed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_history' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE call_history ADD COLUMN transcript text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_history' AND column_name = 'sentiment'
  ) THEN
    ALTER TABLE call_history ADD COLUMN sentiment text DEFAULT 'neutral';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_history' AND column_name = 'next_action'
  ) THEN
    ALTER TABLE call_history ADD COLUMN next_action text DEFAULT '';
  END IF;
END $$;