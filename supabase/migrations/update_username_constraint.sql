-- Update username constraint to allow hyphens and underscores (LinkedIn-style)
-- Also update max length from 30 to 20
-- Remove triggers and functions (handle in application code)

-- Drop old triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_links_updated_at ON links;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop old constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_length;

-- Add updated constraints
ALTER TABLE profiles ADD CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20);
ALTER TABLE profiles ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$');
