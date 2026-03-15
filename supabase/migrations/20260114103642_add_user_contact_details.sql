/*
  # Add User Contact Details to Workspace Members

  1. Changes
    - Add `position` column to workspace_members for job title
    - Add `phone` column to workspace_members for contact number
    - Add `company_phone` column to workspaces for company contact
    - Add `company_email` column to workspaces for company email
  
  2. Notes
    - These fields are optional to maintain backward compatibility
    - Existing records will have NULL values for new fields
*/

-- Add position and phone to workspace_members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_members' AND column_name = 'position'
  ) THEN
    ALTER TABLE workspace_members ADD COLUMN position text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_members' AND column_name = 'phone'
  ) THEN
    ALTER TABLE workspace_members ADD COLUMN phone text;
  END IF;
END $$;

-- Add company contact details to workspaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspaces' AND column_name = 'company_phone'
  ) THEN
    ALTER TABLE workspaces ADD COLUMN company_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspaces' AND column_name = 'company_email'
  ) THEN
    ALTER TABLE workspaces ADD COLUMN company_email text;
  END IF;
END $$;

-- Update sample data with contact details
UPDATE workspace_members SET
  position = 'Chief Executive Officer',
  phone = '+1 (555) 123-4567'
WHERE user_name = 'John Smith';

UPDATE workspace_members SET
  position = 'Operations Director',
  phone = '+1 (555) 123-4568'
WHERE user_name = 'Sarah Johnson';

UPDATE workspace_members SET
  position = 'Sales Manager',
  phone = '+1 (555) 123-4569'
WHERE user_name = 'Mike Davis';

UPDATE workspace_members SET
  position = 'Marketing Specialist',
  phone = '+1 (555) 123-4570'
WHERE user_name = 'Emma Wilson';

UPDATE workspaces SET
  company_phone = '+1 (415) 555-0100',
  company_email = 'contact@acme.com'
WHERE name = 'Acme Corporation';

UPDATE workspaces SET
  company_phone = '+1 (512) 555-0200',
  company_email = 'hello@techstart.com'
WHERE name = 'TechStart Inc';