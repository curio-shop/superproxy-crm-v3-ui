/*
  # Create Sales Leaderboard Table

  1. New Tables
    - `leaderboard_entries`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, foreign key to workspaces)
      - `member_id` (uuid, references workspace_members)
      - `member_name` (text)
      - `member_email` (text)
      - `member_avatar_url` (text)
      - `period_type` (text: 'week', 'month', 'all_time')
      - `period_start` (timestamptz)
      - `period_end` (timestamptz)
      - `total_revenue` (numeric, default 0)
      - `quotations_sent` (integer, default 0)
      - `deals_won` (integer, default 0)
      - `deals_won_value` (numeric, default 0)
      - `invoices_collected` (integer, default 0)
      - `success_rate` (numeric, default 0)
      - `activity_streak` (integer, default 0)
      - `response_time_hours` (numeric, default 0)
      - `points_scored` (integer, default 0)
      - `rank` (integer)
      - `badges` (jsonb, default '[]')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `leaderboard_entries` table
    - Add policy for authenticated users to read leaderboard entries in their workspace
    - Add policy for authenticated users to insert/update their own entries
*/

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  member_id uuid NOT NULL,
  member_name text NOT NULL,
  member_email text NOT NULL,
  member_avatar_url text,
  period_type text NOT NULL CHECK (period_type IN ('week', 'month', 'all_time')),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  total_revenue numeric DEFAULT 0,
  quotations_sent integer DEFAULT 0,
  deals_won integer DEFAULT 0,
  deals_won_value numeric DEFAULT 0,
  invoices_collected integer DEFAULT 0,
  success_rate numeric DEFAULT 0,
  activity_streak integer DEFAULT 0,
  response_time_hours numeric DEFAULT 0,
  points_scored integer DEFAULT 0,
  rank integer,
  badges jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read leaderboard entries in their workspace"
  ON leaderboard_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = leaderboard_entries.workspace_id
      AND workspace_members.user_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can insert their own leaderboard entries"
  ON leaderboard_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    member_email = auth.jwt()->>'email'
  );

CREATE POLICY "Users can update their own leaderboard entries"
  ON leaderboard_entries
  FOR UPDATE
  TO authenticated
  USING (
    member_email = auth.jwt()->>'email'
  )
  WITH CHECK (
    member_email = auth.jwt()->>'email'
  );

CREATE INDEX IF NOT EXISTS idx_leaderboard_workspace ON leaderboard_entries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_entries(period_type, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_entries(workspace_id, period_type, rank);
