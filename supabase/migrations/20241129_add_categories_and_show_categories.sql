-- Migration to add support for new category types and showCategories toggle
-- Date: 2024-11-29

-- Add show_categories column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_categories BOOLEAN DEFAULT FALSE;

-- Update category values in links table to support new categories
-- social, professional, portfolio, content, shop, music, video, contact, resources, others

-- No need to alter the column type since it's already TEXT
-- Just add a comment for documentation
COMMENT ON COLUMN links.category IS 'Category of the link: social, professional, portfolio, content, shop, music, video, contact, resources, others';
