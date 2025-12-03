-- Add color_theme column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'blue-purple';

-- Add comment
COMMENT ON COLUMN profiles.color_theme IS 'Color theme for the profile layout (blue-purple, green-teal, orange-pink)';
