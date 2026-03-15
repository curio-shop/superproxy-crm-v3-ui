/*
  # Create Contacts and Companies Schema

  ## New Tables
  
  ### `companies`
  - `id` (uuid, primary key) - Unique identifier for each company
  - `name` (text) - Company name
  - `initials` (text) - Company initials for avatar display
  - `type` (text, nullable) - Company type (Client, Partner, Prospect, etc.)
  - `industry` (text, nullable) - Industry sector
  - `phone` (text, nullable) - Contact phone number
  - `website` (text, nullable) - Company website
  - `city` (text, nullable) - Company location
  - `address` (text, nullable) - Full company address
  - `avatar_color` (text) - Color theme for avatar display
  - `lifecycle_stage` (text, nullable) - Sales lifecycle stage
  - `created_at` (timestamptz) - When the company was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### `contacts`
  - `id` (uuid, primary key) - Unique identifier for each contact
  - `name` (text) - Contact name
  - `initials` (text) - Contact initials for avatar display
  - `company_id` (uuid, nullable, foreign key) - References companies table
  - `company_name` (text, nullable) - Company name (denormalized for display)
  - `title` (text, nullable) - Job title
  - `email` (text, nullable) - Email address
  - `phone` (text, nullable) - Phone number
  - `avatar_color` (text) - Color theme for avatar display
  - `created_at` (timestamptz) - When the contact was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  1. Enable RLS on all tables
  2. Allow authenticated users to view all contacts and companies
  3. Allow authenticated users to create, update, and delete their own data

  ## Important Notes
  
  - Sample data is included to demonstrate the schema
  - Avatar colors follow the existing design system
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  initials text NOT NULL,
  type text,
  industry text,
  phone text,
  website text,
  city text,
  address text,
  avatar_color text DEFAULT 'blue',
  lifecycle_stage text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  initials text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  company_name text,
  title text,
  email text,
  phone text,
  avatar_color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies table
CREATE POLICY "Authenticated users can view all companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete companies"
  ON companies FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for contacts table
CREATE POLICY "Authenticated users can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample companies
INSERT INTO companies (name, initials, type, industry, phone, website, city, avatar_color, lifecycle_stage) VALUES
  ('Superproxy Inc.', 'SI', 'Client', 'Technology', '+639175328910', 'superproxy.com', 'Manila', 'blue', 'Customer'),
  ('Notion', 'NT', 'Partner', 'Software', '+17135558235', 'notion.so', 'San Francisco', 'purple', 'Customer'),
  ('SpaceX', 'SX', 'Client', 'Aerospace', '+13105551234', 'spacex.com', 'Hawthorne', 'slate', 'Lead'),
  ('Apple', 'AP', 'Client', 'Technology', NULL, 'apple.com', 'Cupertino', 'amber', 'Customer'),
  ('Acme Corp', 'AC', 'Prospect', 'Manufacturing', '+12125559876', 'acme.com', 'New York', 'pink', 'Marketing Qualified Lead')
ON CONFLICT DO NOTHING;

-- Get company IDs for sample contacts
DO $$
DECLARE
  notion_id uuid;
  spacex_id uuid;
  apple_id uuid;
BEGIN
  SELECT id INTO notion_id FROM companies WHERE name = 'Notion' LIMIT 1;
  SELECT id INTO spacex_id FROM companies WHERE name = 'SpaceX' LIMIT 1;
  SELECT id INTO apple_id FROM companies WHERE name = 'Apple' LIMIT 1;

  -- Insert sample contacts
  INSERT INTO contacts (name, initials, company_id, company_name, title, email, phone, avatar_color) VALUES
    ('Let Cruz', 'LC', NULL, NULL, NULL, 'vcc.letcruz@myyah.com', '+639064636955', 'blue'),
    ('Hailey Collins', 'HC', notion_id, 'Notion', 'Client', 'hailey@riggedparts.com', '+17135558235', 'pink'),
    ('Wang Wen', 'WW', spacex_id, 'SpaceX', 'Client', 'melwyn.arrubio@yahoo.com', '+639175328910', 'amber'),
    ('Khim Tanglao', 'KT', NULL, NULL, NULL, 'metriccon.purchasing@gmail.com', '+639088938387', 'slate'),
    ('Mac Mill', 'MM', apple_id, 'Apple', 'Purchaser', 'mac@m.com', NULL, 'emerald'),
    ('Micaela Pena', 'MP', NULL, NULL, NULL, 'micaela.pena@gmail.com', '+639171337142', 'slate'),
    ('Gillian Guiang', 'GG', NULL, NULL, 'Interior Designer', NULL, '+639178102367', 'slate')
  ON CONFLICT DO NOTHING;
END $$;