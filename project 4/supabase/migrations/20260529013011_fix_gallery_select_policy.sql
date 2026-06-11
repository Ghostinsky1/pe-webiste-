/*
  # Fix storage SELECT policies

  1. Changes
    - Add missing SELECT policy for gallery bucket (allows public read access)
    - This fixes the issue where images could be uploaded but not retrieved/displayed

  2. Security
    - Public read access for gallery images (bucket is already marked public)
    - Upload/update/delete still restricted to authenticated users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view gallery images'
  ) THEN
    CREATE POLICY "Anyone can view gallery images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'gallery');
  END IF;
END $$;
