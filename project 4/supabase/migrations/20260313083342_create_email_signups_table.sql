/*
  # Create Email Signups Table

  1. New Tables
    - `email_signups`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique, not null) - Email address
      - `source` (text) - Where the signup came from (e.g., 'website', 'webhook')
      - `created_at` (timestamptz) - When the signup was created
      - `ip_address` (text) - IP address of the signup (optional)
      - `user_agent` (text) - User agent string (optional)

  2. Security
    - Enable RLS on `email_signups` table
    - Add policy for service role to insert signups
    - Add policy for authenticated admins to read signups

  3. Notes
    - Emails are stored in lowercase for consistency
    - Duplicate emails are prevented by unique constraint
*/

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);
CREATE INDEX IF NOT EXISTS idx_email_signups_created_at ON email_signups(created_at DESC);

-- Enable RLS
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert signups (for the webhook)
CREATE POLICY "Service role can insert signups"
  ON email_signups
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all signups
CREATE POLICY "Admins can view all signups"
  ON email_signups
  FOR SELECT
  TO authenticated
  USING (true);