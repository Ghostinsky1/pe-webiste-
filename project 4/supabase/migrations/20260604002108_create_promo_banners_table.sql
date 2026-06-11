/*
  # Create promo banners table

  1. New Tables
    - `promo_banners`
      - `id` (uuid, primary key)
      - `type` (text) - The type of promo: 'bogo', 'low_tickets', 'custom'
      - `title` (text) - Short heading text, e.g. "BOGO DEAL" or "SELLING FAST"
      - `message` (text) - Main promo message displayed to users
      - `is_active` (boolean) - Whether the banner is currently shown
      - `show_on_home` (boolean) - Display on the home page
      - `show_on_events` (boolean) - Display on individual event pages
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `promo_banners` table
    - Add policy for public read access to active banners only
    - Add policy for authenticated admins to manage all banners
*/

CREATE TABLE IF NOT EXISTS promo_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'custom',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT true,
  show_on_events boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;

-- Public can only read active banners
CREATE POLICY "Anyone can view active promo banners"
  ON promo_banners
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all banners (admin)
CREATE POLICY "Authenticated users can view all promo banners"
  ON promo_banners
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert banners
CREATE POLICY "Authenticated users can insert promo banners"
  ON promo_banners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update banners
CREATE POLICY "Authenticated users can update promo banners"
  ON promo_banners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete banners
CREATE POLICY "Authenticated users can delete promo banners"
  ON promo_banners
  FOR DELETE
  TO authenticated
  USING (true);

-- Seed default promo types so admin can just toggle them
INSERT INTO promo_banners (type, title, message, is_active, show_on_home, show_on_events)
VALUES
  ('bogo', 'BOGO DEAL', 'Buy one ticket, get one FREE. Limited time only.', false, true, true),
  ('low_tickets', 'SELLING FAST', 'Less than 50 tickets remaining. Don''t miss out.', false, true, true),
  ('custom', 'SPECIAL OFFER', 'Use code PERREO for 20% off all tickets.', false, true, true)
ON CONFLICT DO NOTHING;