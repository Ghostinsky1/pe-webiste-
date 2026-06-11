/*
  # Add per-show promo banner fields

  1. Modified Tables
    - `shows`
      - `promo_active` (boolean, default false) - Whether the promo banner is shown for this event
      - `promo_type` (text, default 'custom') - Type of promo: 'bogo', 'low_tickets', 'custom'
      - `promo_title` (text, default '') - Short heading text for the banner
      - `promo_message` (text, default '') - Main promo message displayed to visitors

  2. Notes
    - Each show can have its own promo banner toggled independently
    - Admins control these from the show edit form
    - The global promo_banners table remains available but these per-show fields take priority on event pages
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'promo_active'
  ) THEN
    ALTER TABLE shows ADD COLUMN promo_active boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'promo_type'
  ) THEN
    ALTER TABLE shows ADD COLUMN promo_type text NOT NULL DEFAULT 'custom';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'promo_title'
  ) THEN
    ALTER TABLE shows ADD COLUMN promo_title text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'promo_message'
  ) THEN
    ALTER TABLE shows ADD COLUMN promo_message text NOT NULL DEFAULT '';
  END IF;
END $$;