/*
  # Update Let Cruz Contact Information

  1. Updates
    - Add position/title for Let Cruz contact
    - Add company information for Let Cruz contact

  2. Changes
    - Updates the existing "Let Cruz" contact with title "Operations Manager"
    - Associates Let Cruz with company "Techflow Solutions"
*/

DO $$
DECLARE
  company_uuid uuid;
BEGIN
  -- Check if company exists, if not create it
  INSERT INTO companies (name, initials, industry, website, city, avatar_color)
  VALUES (
    'Techflow Solutions',
    'TS',
    'Technology Services',
    'www.techflowsolutions.com',
    'Manila',
    'blue'
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO company_uuid;

  -- Get company_id if it already existed
  IF company_uuid IS NULL THEN
    SELECT id INTO company_uuid FROM companies WHERE name = 'Techflow Solutions' LIMIT 1;
  END IF;

  -- Update Let Cruz contact information
  UPDATE contacts
  SET
    company_id = company_uuid,
    company_name = 'Techflow Solutions',
    title = 'Operations Manager'
  WHERE email = 'vcc.letcruz@myyah.com';
END $$;
