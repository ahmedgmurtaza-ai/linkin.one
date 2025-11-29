-- Storage Bucket Setup for Profile Images
-- Run this in Supabase SQL Editor after running schema.sql

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Allow authenticated users to upload to profile-images bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Allow public read access to profile-images bucket
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public, authenticated
USING (bucket_id = 'profile-images');

-- Allow authenticated users to update their files
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images')
WITH CHECK (bucket_id = 'profile-images');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');

-- Verify the setup
SELECT 
    'Bucket Created: ' || name as status,
    'Public: ' || public::text as visibility
FROM storage.buckets 
WHERE id = 'profile-images';

SELECT 
    'Policy: ' || policyname as policy_name,
    'Command: ' || cmd as operation
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profile%' OR policyname LIKE '%authenticated%' OR policyname LIKE '%public%';
