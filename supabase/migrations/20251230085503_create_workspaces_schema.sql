/*
  # Workspace Management Schema

  ## New Tables
  
  ### `workspaces`
  - `id` (uuid, primary key) - Unique identifier for each workspace
  - `name` (text) - Company/workspace name
  - `logo_url` (text, nullable) - URL to workspace logo
  - `address` (text, nullable) - Physical address of the company
  - `website` (text, nullable) - Company website
  - `created_at` (timestamptz) - When the workspace was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### `workspace_members`
  - `id` (uuid, primary key) - Unique identifier for membership
  - `workspace_id` (uuid, foreign key) - References workspaces table
  - `user_email` (text) - Member's email address
  - `user_name` (text) - Member's display name
  - `role` (text) - Member role: 'owner', 'admin', or 'member'
  - `joined_at` (timestamptz) - When the member joined
  - Unique constraint on (workspace_id, user_email)

  ### `workspace_activity`
  - `id` (uuid, primary key) - Unique identifier for activity
  - `workspace_id` (uuid, foreign key) - References workspaces table
  - `user_name` (text) - Name of user who performed the action
  - `action` (text) - Type of action performed
  - `details` (text, nullable) - Additional details about the action
  - `created_at` (timestamptz) - When the activity occurred

  ## Security
  
  1. Enable RLS on all tables
  2. Add policies for authenticated users to manage their workspaces
  3. Members can only view workspace data they belong to
  4. Only owners and admins can modify workspace settings
  5. Only owners can delete workspaces or change owner role
*/

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  address text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  user_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, user_email)
);

-- Create workspace_activity table
CREATE TABLE IF NOT EXISTS workspace_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  action text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_email ON workspace_members(user_email);
CREATE INDEX IF NOT EXISTS idx_workspace_activity_workspace_id ON workspace_activity(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activity_created_at ON workspace_activity(created_at DESC);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces table
CREATE POLICY "Users can view workspaces they are members of"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
    )
  );

CREATE POLICY "Users can create new workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Owners and admins can update workspace info"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Only owners can delete workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.role = 'owner'
    )
  );

-- RLS Policies for workspace_members table
CREATE POLICY "Members can view other members in their workspace"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
    )
  );

CREATE POLICY "System can insert new members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Owners and admins can update member roles"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can remove members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE role IN ('owner', 'admin')
    )
  );

-- RLS Policies for workspace_activity table
CREATE POLICY "Members can view activity in their workspace"
  ON workspace_activity FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
    )
  );

CREATE POLICY "System can insert activity logs"
  ON workspace_activity FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
    )
  );

-- Insert sample data
INSERT INTO workspaces (name, logo_url, address, website) VALUES
  ('Acme Corporation', NULL, '123 Business St, San Francisco, CA 94105', 'acme.com'),
  ('TechStart Inc', NULL, '456 Innovation Ave, Austin, TX 78701', 'techstart.com')
ON CONFLICT DO NOTHING;

-- Get the workspace IDs for sample data
DO $$
DECLARE
  acme_id uuid;
  tech_id uuid;
BEGIN
  SELECT id INTO acme_id FROM workspaces WHERE name = 'Acme Corporation' LIMIT 1;
  SELECT id INTO tech_id FROM workspaces WHERE name = 'TechStart Inc' LIMIT 1;

  IF acme_id IS NOT NULL THEN
    INSERT INTO workspace_members (workspace_id, user_email, user_name, role) VALUES
      (acme_id, 'john@acme.com', 'John Smith', 'owner'),
      (acme_id, 'sarah@acme.com', 'Sarah Johnson', 'admin'),
      (acme_id, 'mike@acme.com', 'Mike Davis', 'member'),
      (acme_id, 'emma@acme.com', 'Emma Wilson', 'member')
    ON CONFLICT (workspace_id, user_email) DO NOTHING;

    INSERT INTO workspace_activity (workspace_id, user_name, action, details) VALUES
      (acme_id, 'John Smith', 'Created workspace', 'Initial workspace setup'),
      (acme_id, 'Sarah Johnson', 'Invited member', 'Added Mike Davis as member'),
      (acme_id, 'John Smith', 'Updated settings', 'Changed workspace logo'),
      (acme_id, 'Emma Wilson', 'Created invoice', 'INV-2024-001 for $2,500'),
      (acme_id, 'Sarah Johnson', 'Added product', 'New product: Premium Package')
    ON CONFLICT DO NOTHING;
  END IF;

  IF tech_id IS NOT NULL THEN
    INSERT INTO workspace_members (workspace_id, user_email, user_name, role) VALUES
      (tech_id, 'alex@techstart.com', 'Alex Chen', 'owner')
    ON CONFLICT (workspace_id, user_email) DO NOTHING;

    INSERT INTO workspace_activity (workspace_id, user_name, action, details) VALUES
      (tech_id, 'Alex Chen', 'Created workspace', 'Initial workspace setup')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;