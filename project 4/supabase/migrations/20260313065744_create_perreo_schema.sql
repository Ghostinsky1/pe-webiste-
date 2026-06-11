/*
  # Perreo Eléctrico — Initial Schema

  1. New Tables
    - `shows`
      - `id` (uuid, primary key)
      - `date` (date, not null) — show date
      - `city` (text) — city name
      - `state` (text) — state abbreviation
      - `venue` (text) — venue name
      - `ticket_url` (text) — external ticketing link
      - `status` (text, default 'on_sale') — 'on_sale' | 'sold_out' | 'past'
      - `notes` (text) — optional notes
      - `created_at` (timestamptz)
      - `sort_order` (int, default 0)
    - `gallery_images`
      - `id` (uuid, primary key)
      - `storage_path` (text) — path in Supabase storage bucket 'gallery'
      - `alt_text` (text) — accessible description
      - `sort_order` (int, default 0)
      - `created_at` (timestamptz)
    - `site_settings`
      - `key` (text, primary key) — setting key e.g. 'hero_headline'
      - `value` (text) — setting value

  2. Security
    - Enable RLS on all tables
    - Public read access on shows, gallery_images, site_settings
    - Authenticated-only write access on all tables

  3. Storage
    - Public bucket 'gallery' for gallery images

  4. Seed Data
    - site_settings defaults
    - show dates for 2026 tour
*/

CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  venue text NOT NULL,
  ticket_url text,
  status text DEFAULT 'on_sale',
  notes text,
  created_at timestamptz DEFAULT now(),
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  alt_text text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text
);

ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read shows"
  ON shows FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shows"
  ON shows FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shows"
  ON shows FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shows"
  ON shows FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read gallery_images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery_images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery_images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery_images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO site_settings (key, value) VALUES
  ('hero_headline', 'Coming to a City Near You'),
  ('hero_subline', 'The Reggaetón Rave on Tour'),
  ('hero_desc', 'Raw perreo, dembow, techno, and club energy in one sweat-soaked night. No stage. No barriers. Just bass, bodies, and full send.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO shows (date, city, state, venue, ticket_url, status, sort_order) VALUES
  ('2026-03-21', 'St. Louis', 'MO', 'Mississippi Underground', 'https://theticketing.co/e/perreostl', 'on_sale', 1),
  ('2026-03-27', 'Salt Lake City', 'UT', '801 Event Center · 18+', 'https://www.eventbrite.com/e/perreo-electrico-salt-lake-city-tickets-1984411270529', 'on_sale', 2),
  ('2026-03-28', 'Denver', 'CO', 'Ophelia''s Electric Soapbox', 'https://www.ticketmaster.com/perreo-electrico-denver-colorado-03-28-2026/event/1E00643C88DF3DC3', 'on_sale', 3),
  ('2026-04-04', 'Kansas City', 'MO', 'Warehouse on Broadway', 'https://www.etix.com/ticket/p/98991688/', 'on_sale', 4),
  ('2026-04-10', 'St. Louis', 'MO', 'Mississippi Underground', 'https://theticketing.co/e/perreostl', 'on_sale', 5),
  ('2026-04-18', 'Nashville', 'TN', 'Cannery Hall', 'https://linktr.ee/GozaEnt', 'on_sale', 6),
  ('2026-05-15', 'Portland / Vancouver', 'WA', 'El Dubai', 'https://linktr.ee/GozaEnt', 'on_sale', 7),
  ('2026-05-16', 'Pasco / Kennewick', 'WA', 'Tequilas', 'https://linktr.ee/GozaEnt', 'on_sale', 8),
  ('2026-05-17', 'Seattle / Kent', 'WA', 'El Parral', 'https://linktr.ee/GozaEnt', 'on_sale', 9),
  ('2026-06-18', 'Kansas City', 'MO', 'Warehouse on Broadway', 'https://www.etix.com/ticket/p/98991688/', 'on_sale', 10);
