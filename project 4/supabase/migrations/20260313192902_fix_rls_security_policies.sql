/*
  # Fix Critical RLS Security Issues

  1. Security Improvements
    - Create admin role check function to properly verify admin users
    - Drop all overly permissive policies that use USING (true)
    - Create restrictive policies that only allow admin users to modify data
    - Remove duplicate testimonials SELECT policies
    - Fix function search_path to be immutable

  2. Changes
    - **Admin Function**: Create `is_admin()` function to check if user has admin role
    - **Shows Table**: Replace permissive policies with admin-only policies
    - **Gallery Images**: Replace permissive policies with admin-only policies
    - **Past Cities**: Replace permissive policies with admin-only policies
    - **Site Settings**: Replace permissive policies with admin-only policies
    - **Testimonials**: Fix duplicate SELECT policies and add admin-only checks
    - **Function Fix**: Update `update_testimonials_updated_at` with immutable search_path

  3. Security Model
    - Public users: Can only view published/active content (SELECT only)
    - Authenticated non-admin users: Same as public
    - Admin users: Full CRUD access (checked via is_admin() function)
    - All modification operations require admin role

  4. Notes
    - Admin role should be assigned via `raw_app_meta_data` in auth.users table
    - Use: UPDATE auth.users SET raw_app_meta_data = '{"role": "admin"}' WHERE email = 'admin@example.com';
    - This is secure because users cannot modify their own app_metadata
*/

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$;

-- Fix update_testimonials_updated_at function search_path (use CASCADE)
DROP TRIGGER IF EXISTS testimonials_updated_at ON public.testimonials;
DROP FUNCTION IF EXISTS public.update_testimonials_updated_at() CASCADE;

CREATE FUNCTION public.update_testimonials_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_testimonials_updated_at();

-- ============================================================================
-- SHOWS TABLE - Fix Policies
-- ============================================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert shows" ON public.shows;
DROP POLICY IF EXISTS "Authenticated users can update shows" ON public.shows;
DROP POLICY IF EXISTS "Authenticated users can delete shows" ON public.shows;

-- Keep public read access
-- DROP POLICY IF EXISTS "Anyone can view shows" ON public.shows; -- Keep this one

-- Create admin-only policies
CREATE POLICY "Admins can insert shows"
  ON public.shows
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update shows"
  ON public.shows
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete shows"
  ON public.shows
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- GALLERY_IMAGES TABLE - Fix Policies
-- ============================================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery_images" ON public.gallery_images;

-- Keep public read access
-- DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images; -- Keep this one

-- Create admin-only policies
CREATE POLICY "Admins can insert gallery_images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery_images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete gallery_images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- PAST_CITIES TABLE - Fix Policies
-- ============================================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert past cities" ON public.past_cities;
DROP POLICY IF EXISTS "Authenticated users can update past cities" ON public.past_cities;
DROP POLICY IF EXISTS "Authenticated users can delete past cities" ON public.past_cities;

-- Keep public read access
-- DROP POLICY IF EXISTS "Anyone can view past cities" ON public.past_cities; -- Keep this one

-- Create admin-only policies
CREATE POLICY "Admins can insert past cities"
  ON public.past_cities
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update past cities"
  ON public.past_cities
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete past cities"
  ON public.past_cities
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- SITE_SETTINGS TABLE - Fix Policies
-- ============================================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site_settings" ON public.site_settings;

-- Keep public read access
-- DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings; -- Keep this one

-- Create admin-only policies
CREATE POLICY "Admins can insert site_settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- TESTIMONIALS TABLE - Fix Policies (Remove duplicate + add restrictions)
-- ============================================================================

-- Drop ALL existing policies to clean slate
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.testimonials;

-- Create single public read policy for active testimonials only
CREATE POLICY "Public can view active testimonials"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create admin-only read policy for all testimonials
CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create admin-only modification policies
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (is_admin());
