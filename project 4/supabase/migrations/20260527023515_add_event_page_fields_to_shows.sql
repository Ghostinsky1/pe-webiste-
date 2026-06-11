/*
  # Add event page fields to shows table

  1. Modified Tables
    - `shows`
      - `slug` (text, unique) - URL-friendly identifier for the event page
      - `description` (text) - About section text for the event page
      - `flyer_image_url` (text) - URL to the event flyer image
      - `doors_time` (text) - Time doors open (e.g., "9:00 PM")
      - `end_time` (text) - Event end time (e.g., "2:00 AM")
      - `age_restriction` (text) - Age requirement (e.g., "18+")
      - `address` (text) - Full venue address for map links

  2. Notes
    - slug is generated from city-state-date pattern
    - All new fields are optional to maintain backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'slug'
  ) THEN
    ALTER TABLE shows ADD COLUMN slug text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'description'
  ) THEN
    ALTER TABLE shows ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'flyer_image_url'
  ) THEN
    ALTER TABLE shows ADD COLUMN flyer_image_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'doors_time'
  ) THEN
    ALTER TABLE shows ADD COLUMN doors_time text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE shows ADD COLUMN end_time text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'age_restriction'
  ) THEN
    ALTER TABLE shows ADD COLUMN age_restriction text DEFAULT '18+';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'address'
  ) THEN
    ALTER TABLE shows ADD COLUMN address text DEFAULT '';
  END IF;
END $$;

-- Generate slugs for existing shows that don't have one
UPDATE shows
SET slug = LOWER(
  REPLACE(
    REPLACE(
      CONCAT(city, '-', state, '-', TO_CHAR(date, 'YYYY-MM-DD')),
      ' ', '-'
    ),
    '.', ''
  )
)
WHERE slug IS NULL;