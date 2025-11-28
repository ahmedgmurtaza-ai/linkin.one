# Supabase Authentication Setup

This project now includes Supabase authentication. Follow these steps to configure it:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

## 3. Configure Environment Variables

Update the `.env.local` file in your project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Set Up Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add the following URLs to your allowed redirect URLs:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://yourdomain.com/auth/callback` (for production)

## 5. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure your email templates if needed

## 6. Start Your Development Server

```bash
pnpm dev
```

## Features

### Protected Routes

- `/admin` - Admin dashboard (requires authentication)
- All other routes are automatically protected by default

### Public Routes

- `/login` - Login and signup page
- `/[username]` - Public profile pages
- `/[username]/[platform]` - Public platform-specific pages

### Authentication Components

- **LoginForm** (`components/auth/login-form.tsx`) - Login and signup form
- **UserNav** (`components/auth/user-nav.tsx`) - User info and logout button
- **Middleware** (`middleware.ts`) - Automatic route protection

### Usage

#### Sign Up

1. Go to `/login`
2. Enter your email and password
3. Click "Sign Up"
4. Check your email for the confirmation link

#### Sign In

1. Go to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to `/admin`

#### Sign Out

Click the "Sign Out" button in the admin top bar.

## API Reference

### Client-Side Auth

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign up
await supabase.auth.signUp({ email, password });

// Sign out
await supabase.auth.signOut();

// Get current user
const {
  data: { user },
} = await supabase.auth.getUser();
```

### Server-Side Auth

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
```

## Troubleshooting

### "Invalid login credentials"

- Make sure you've confirmed your email
- Check that your password is correct
- Verify your Supabase credentials in `.env.local`

### Redirects not working

- Check that you've added the callback URL to Supabase's allowed redirect URLs
- Make sure middleware is properly configured

### Session not persisting

- Clear your browser cookies
- Check that cookies are enabled
- Verify middleware is running correctly

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase for database tables
- Consider enabling MFA for admin users
