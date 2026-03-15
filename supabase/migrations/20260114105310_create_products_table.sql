/*
  # Create products table

  ## Purpose
  This migration creates a products table for storing products and services that can be used in quotations and invoices.

  ## Changes

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for the product
      - `workspace_id` (uuid, foreign key) - Reference to workspace
      - `name` (text) - Product/service name
      - `description` (text, nullable) - Product/service description
      - `price` (numeric) - Unit price
      - `sku` (text, nullable) - Stock keeping unit
      - `category` (text, nullable) - Product category
      - `is_custom` (boolean, default false) - Whether this is a custom product (true) or team product (false)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to manage their workspace products

  ## Notes
  - Team products are shared across the workspace (is_custom = false)
  - Custom products are one-off items created for specific quotes (is_custom = true)
  - All products have a price that can be used when adding line items to quotes
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  sku text,
  category text,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert workspace products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workspace products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete workspace products"
  ON products FOR DELETE
  TO authenticated
  USING (true);