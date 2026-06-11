/*
  # Fix Security Issues

  1. Storage Policies
    - Drop broad SELECT policies on `storage.objects` for `flyers` and `gallery` buckets
    - Public buckets serve files via direct URLs without needing SELECT policies
    - This prevents clients from listing all files in the buckets

  2. Functions
    - Revoke EXECUTE from `anon` and `authenticated` on `public.is_admin()`
    - Revoke EXECUTE from `anon` and `authenticated` on `public.update_testimonials_updated_at()`
    - `is_admin()` is used internally by RLS policies (which run as SECURITY DEFINER context)
      and should not be callable directly via the REST API
    - `update_testimonials_updated_at()` is a trigger function and should not be callable via REST API
*/

-- Remove broad SELECT policies that allow listing all files
DROP POLICY IF EXISTS "Anyone can view flyers" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;

-- Revoke EXECUTE on is_admin() from public-facing roles
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;

-- Revoke EXECUTE on update_testimonials_updated_at() from public-facing roles
REVOKE EXECUTE ON FUNCTION public.update_testimonials_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_testimonials_updated_at() FROM authenticated;