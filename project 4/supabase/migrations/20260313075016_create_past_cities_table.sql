/*
  # Create past_cities table for "We've Been There" section

  1. New Tables
    - `past_cities`
      - `id` (uuid, primary key) - Unique identifier for each city entry
      - `city` (text) - City name
      - `state` (text) - State abbreviation
      - `venue` (text, nullable) - Venue name
      - `date` (text, nullable) - Display date (e.g., "OCT 2025")
      - `attendance` (text, nullable) - Attendance count (e.g., "650+")
      - `sort_order` (integer, default 0) - For manual ordering
      - `created_at` (timestamptz, default now()) - Timestamp

  2. Security
    - Enable RLS on `past_cities` table
    - Add policy for public read access (anon users can view)
    - Add policy for authenticated users to manage all operations
*/

CREATE TABLE IF NOT EXISTS past_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  state text NOT NULL,
  venue text,
  date text,
  attendance text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE past_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view past cities"
  ON past_cities
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert past cities"
  ON past_cities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update past cities"
  ON past_cities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete past cities"
  ON past_cities
  FOR DELETE
  TO authenticated
  USING (true);