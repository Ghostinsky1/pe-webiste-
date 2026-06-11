/*
  # Create flyers storage bucket

  1. New Storage
    - `flyers` bucket for event flyer images
    - Public access enabled for reading flyer images
  
  2. Security
    - Authenticated users can upload flyers
    - Anyone can view flyers (public bucket)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('flyers', 'flyers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload flyers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'flyers');

CREATE POLICY "Authenticated users can update flyers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'flyers')
  WITH CHECK (bucket_id = 'flyers');

CREATE POLICY "Authenticated users can delete flyers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'flyers');

CREATE POLICY "Anyone can view flyers"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'flyers');