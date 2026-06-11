/*
  # Create Testimonials Table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key) - Unique identifier
      - `quote` (text, not null) - Testimonial quote
      - `name` (text, not null) - Person's name
      - `city` (text, not null) - City and state
      - `sort_order` (integer, default 0) - Display order
      - `is_active` (boolean, default true) - Whether to display
      - `created_at` (timestamptz) - When created
      - `updated_at` (timestamptz) - When last updated

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access (only active testimonials)
    - Add policy for authenticated users to manage testimonials

  3. Initial Data
    - Populate with existing testimonials from the site

  4. Notes
    - Testimonials are ordered by sort_order for display control
    - Only active testimonials are shown to the public
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view active testimonials
CREATE POLICY "Anyone can view active testimonials"
  ON testimonials
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all testimonials
CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert testimonials
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update testimonials
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete testimonials
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert initial testimonials
INSERT INTO testimonials (quote, name, city, sort_order, is_active) VALUES
  ('I''ve been to raves all over the world. Perreo Eléctrico hits different — there''s no barrier between the music and the people. Just pure energy.', 'María G.', 'Denver, CO', 1, true),
  ('The first time I went I cried. It was the first time I''d heard my music — reggaetón, dembow — in a rave setting. It felt like home.', 'Carlos R.', 'St. Louis, MO', 2, true),
  ('Left absolutely drenched. The bass doesn''t stop. The crowd doesn''t stop. It''s what every night should feel like.', 'Jasmine P.', 'Nashville, TN', 3, true)
ON CONFLICT DO NOTHING;