-- Create users table for NextAuth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email_verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Update profiles table to reference our new users table instead of auth.users
-- We'll need to add a user_id column and make it reference our new users table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nextauth_user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_profiles_nextauth_user_id ON profiles(nextauth_user_id);

-- Add constraint to ensure either user_id (old Supabase auth) or nextauth_user_id exists
ALTER TABLE profiles ADD CONSTRAINT chk_user_reference CHECK (
  (user_id IS NOT NULL AND nextauth_user_id IS NULL) OR 
  (user_id IS NULL AND nextauth_user_id IS NOT NULL)
);