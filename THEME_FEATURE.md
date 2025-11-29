# Profile Theme Feature Implementation

## Overview

Implemented a feature that allows users to set light and dark mode preferences for their public profiles. Users can choose between:

- **Light Mode**: Always display the profile in light mode
- **Dark Mode**: Always display the profile in dark mode
- **System**: Match the visitor's system preferences (default)

## Changes Made

### 1. Database Schema (`supabase/schema.sql`)

- Added `theme` column to `profiles` table with default value `'system'`
- Supports values: `'light'`, `'dark'`, `'system'`

### 2. Database Migration (`supabase/migrations/add_theme_to_profiles.sql`)

- Created migration file to add the `theme` column to existing databases
- Includes check constraint to validate theme values
- Updates existing profiles to use `'system'` as default

### 3. TypeScript Types (`lib/types.ts`)

- Added `ProfileTheme` type: `"light" | "dark" | "system"`
- Added optional `theme` field to `Profile` interface

### 4. Database Operations

Updated both server-side (`lib/database.ts`) and client-side (`lib/database-client.ts`) database operations:

- Added `theme` field to `DbProfile` interface
- Updated `dbProfileToProfile` conversion function to include theme
- Updated `updateProfile` function to handle theme updates

### 5. Profile Editor Hook (`lib/use-profile-editor.ts`)

- Updated profile loading to include theme field
- Theme defaults to `'system'` if not set

### 6. Admin Panel Components

#### Theme Selector Component (`components/admin/theme-selector.tsx`)

New component that provides a visual interface for selecting profile theme:

- Three buttons with icons (Sun, Moon, Monitor)
- Clear descriptions for each option
- Highlights the currently selected theme

#### Profile Form (`components/admin/profile-form.tsx`)

- Integrated `ThemeSelector` component
- Added theme update handler
- Positioned at the bottom of the profile settings form

### 7. Public Profile Display

#### Profile Theme Provider (`components/profile-theme-provider.tsx`)

New client component that applies the user's theme preference:

- For `'light'`: Forces light mode
- For `'dark'`: Forces dark mode
- For `'system'`: Uses visitor's system preference and listens for changes

#### Profile Page (`app/[username]/page.tsx`)

- Wrapped profile content with `ProfileThemeProvider`
- Passes user's theme preference to the provider

### 8. Demo Data (`lib/profile-store.ts`)

- Updated demo profile to include theme field

## How It Works

1. **Admin Panel**: Users select their preferred theme in Profile Settings
2. **Database**: Theme preference is saved to the `profiles` table
3. **Public Profile**: When visitors view the profile:
   - The `ProfileThemeProvider` reads the user's theme preference
   - Applies appropriate CSS classes to the document root
   - For "system" mode, listens to visitor's system preference changes
4. **Theme Application**: The theme is applied by toggling the `dark` class on the HTML element

## Database Migration

To apply the theme column to an existing database, run:

```sql
-- Execute the migration file
\i supabase/migrations/add_theme_to_profiles.sql
```

Or use Supabase CLI:

```bash
supabase db push
```

## User Experience

### For Profile Owners (Admin Panel)

- Navigate to Profile Settings
- Scroll to "Profile Theme" section
- Click on Light, Dark, or System button
- Changes save automatically

### For Profile Visitors

- Visit any profile page
- See the profile in the owner's preferred theme
- If owner chose "system", see it in your own system preference
- Theme changes dynamically if system preference changes (system mode only)

## Notes

- Theme preference is per-profile, not per-user
- Default theme is "system" to respect visitor preferences
- Theme is applied at the page level, affecting all components
- Compatible with existing theme toggle for admin panel (admin panel uses separate theme state)
