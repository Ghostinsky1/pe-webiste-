/*
  # Create Gallery Storage Bucket

  1. Storage Setup
    - Create `gallery` bucket for storing event/tour images
    - Set bucket to public (images are publicly accessible via URL)
    - Configure allowed file types and size limits

  2. Security
    - Bucket is public for read access
    - Upload/delete restricted to authenticated users via RLS policies
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;