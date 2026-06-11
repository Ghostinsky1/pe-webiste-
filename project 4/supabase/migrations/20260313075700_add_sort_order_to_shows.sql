/*
  # Add sort_order column to shows table

  1. Changes
    - Add `sort_order` column to `shows` table for manual ordering
    - Default to 0 for existing records
    - Initialize sort_order for existing shows based on date

  2. Notes
    - Allows admin to manually reorder shows in dashboard
    - Used alongside date sorting for display control
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shows' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE shows ADD COLUMN sort_order integer DEFAULT 0;
    
    UPDATE shows SET sort_order = (
      SELECT COUNT(*) FROM shows s2 WHERE s2.date < shows.date
    );
  END IF;
END $$;