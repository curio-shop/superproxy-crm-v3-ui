/*
  # Add User Profile Photo

  1. Changes
    - Add `profile_photo_url` column to workspace_members for user avatar
  
  2. Notes
    - This field is optional
    - Existing records will have NULL values
*/

-- Add profile photo URL to workspace_members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_members' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE workspace_members ADD COLUMN profile_photo_url text;
  END IF;
END $$;

-- Update sample data with profile photos (using placeholder service)
UPDATE workspace_members SET
  profile_photo_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
WHERE user_name = 'John Smith';

UPDATE workspace_members SET
  profile_photo_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
WHERE user_name = 'Sarah Johnson';

UPDATE workspace_members SET
  profile_photo_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
WHERE user_name = 'Mike Davis';

UPDATE workspace_members SET
  profile_photo_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
WHERE user_name = 'Emma Wilson';