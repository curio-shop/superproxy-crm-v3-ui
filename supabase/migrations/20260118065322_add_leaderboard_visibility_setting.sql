/*
  # Add Leaderboard Visibility Setting

  1. Changes
    - Add `show_leaderboard` column to workspaces table
      - Default value is `true` (leaderboard visible by default)
      - Allows users to hide/show the sales leaderboard section

  2. Notes
    - This is a workspace-level setting that applies to all members
    - Only owners and admins can change this setting (existing RLS policies apply)
*/

-- Add show_leaderboard column to workspaces table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspaces' AND column_name = 'show_leaderboard'
  ) THEN
    ALTER TABLE workspaces ADD COLUMN show_leaderboard boolean DEFAULT true;
  END IF;
END $$;