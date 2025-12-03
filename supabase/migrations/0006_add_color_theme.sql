-- Add color_theme column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT '#a88bf8';

-- Add comment
COMMENT ON COLUMN profiles.color_theme IS 'Hex color value for the profile theme (e.g., #a88bf8)';
