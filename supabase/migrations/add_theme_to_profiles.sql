-- Migration: Add theme column to profiles table
-- Created: 2025-11-29

-- Add theme column with default value 'system'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'system';

-- Add check constraint to ensure theme is one of the valid values
ALTER TABLE profiles
ADD CONSTRAINT theme_check CHECK (theme IN ('light', 'dark', 'system'));

-- Update existing profiles to have 'system' as default theme if NULL
UPDATE profiles 
SET theme = 'system' 
WHERE theme IS NULL;
