# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your linkin.one application.

## Prerequisites

- A Supabase project (already created)
- A Google Cloud account

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:

   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth credentials:

   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Configure the OAuth consent screen if prompted:
     - Choose **External** user type
     - Fill in the required information (App name, User support email, Developer contact)
     - Add scopes: `email`, `profile`, `openid`
     - Save and continue

5. Create OAuth Client ID:

   - Application type: **Web application**
   - Name: `linkin.one` (or any name you prefer)
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://linkin.one`)
   - **Authorized redirect URIs**:
     - Get this from Supabase (see Step 2)

6. Save your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `linkin.one`
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and enable it
5. Copy the **Callback URL (for OAuth)** - it should look like:
   ```
   https://chqdsjxhgwryuvajefpg.supabase.co/auth/v1/callback
   ```
6. Add this URL to your Google OAuth **Authorized redirect URIs** (from Step 1)
7. In Supabase, enter your Google **Client ID** and **Client Secret**
8. Save the configuration

## Step 3: Update Environment Variables

The `.env.local` file has been updated with the necessary configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://chqdsjxhgwryuvajefpg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_SITE_URL` to your production domain.

## Step 4: Test the Integration

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/login
3. Click "Continue with Google"
4. Complete the Google sign-in flow
5. You should be redirected to `/admin` after successful authentication

## Important Notes

### For Production Deployment

1. Add your production domain to:
   - Google OAuth **Authorized JavaScript origins**
   - Google OAuth **Authorized redirect URIs**
2. Update `NEXT_PUBLIC_SITE_URL` in your production environment variables

3. Ensure your Supabase project's **Site URL** is set correctly:
   - Go to **Authentication** > **URL Configuration**
   - Set **Site URL** to your production domain

### Security Considerations

- Never commit `.env.local` to version control
- Keep your Google Client Secret secure
- Regularly rotate credentials if compromised
- Enable Google OAuth consent screen for production
- Configure proper scopes (email, profile, openid are sufficient)

### Troubleshooting

**"Redirect URI mismatch" error:**

- Ensure the redirect URI in Google Console matches the Supabase callback URL exactly
- Check for trailing slashes

**"Access blocked" error:**

- Your OAuth consent screen needs to be verified by Google for production use
- Add test users in the OAuth consent screen settings for testing

**User not redirected after login:**

- Check that `NEXT_PUBLIC_SITE_URL` is set correctly
- Verify the callback route at `/auth/callback` is working
- Check browser console for errors

## Additional Resources

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
