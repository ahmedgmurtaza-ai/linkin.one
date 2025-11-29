# Database Setup Guide

This guide will help you set up the Supabase database for your linkin.one application.

## Prerequisites

- A Supabase project (already created)
- Admin access to your Supabase dashboard

## Step 1: Run Database Schema

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `linkin.one`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

The schema will create:

- `profiles` table - User profile information
- `links` table - Social media and other links
- `link_analytics` table - Click and download tracking
- Row Level Security (RLS) policies
- Database triggers for automatic timestamps
- Automatic profile creation on user signup

## Step 2: Verify Tables

After running the schema, verify that the tables were created:

1. Go to **Table Editor** in the left sidebar
2. You should see three new tables:
   - `profiles`
   - `links`
   - `link_analytics`

## Step 3: Test the Integration

### Create Your First Profile

1. Sign up or log in to your application
2. A profile will be automatically created based on your email
3. Go to the admin dashboard at `/admin`
4. Update your profile information

### Add Links

1. In the admin dashboard, go to the **Links** tab
2. Click "Add Link"
3. Fill in the link details and save
4. The link will be stored in the database

### View Your Public Profile

1. Go to `/your-username` (use the username from your profile)
2. Your profile and links should be displayed
3. This data is loaded from the database

## Database Structure

### Profiles Table

| Column        | Type      | Description                       |
| ------------- | --------- | --------------------------------- |
| id            | UUID      | Primary key                       |
| user_id       | UUID      | References auth.users (FK)        |
| username      | TEXT      | Unique username for profile URL   |
| display_name  | TEXT      | Display name shown on profile     |
| description   | TEXT      | Bio/description text              |
| thumbnail_url | TEXT      | Profile image URL                 |
| layout        | TEXT      | Layout style (classic/split/grid) |
| created_at    | TIMESTAMP | Created timestamp                 |
| updated_at    | TIMESTAMP | Last updated timestamp            |

**Constraints:**

- Username must be 3-30 characters
- Username can only contain lowercase letters and numbers
- Username must be unique across all profiles

### Links Table

| Column          | Type      | Description                                |
| --------------- | --------- | ------------------------------------------ |
| id              | UUID      | Primary key                                |
| profile_id      | UUID      | References profiles (FK)                   |
| title           | TEXT      | Link title/label                           |
| url             | TEXT      | Link URL                                   |
| platform        | TEXT      | Platform identifier (twitter, github, etc) |
| category        | TEXT      | Category (social/business/personal)        |
| icon            | TEXT      | Optional custom icon                       |
| is_downloadable | BOOLEAN   | Whether link is downloadable               |
| link_type       | TEXT      | Type (url/file)                            |
| position        | INTEGER   | Display order (0-based)                    |
| created_at      | TIMESTAMP | Created timestamp                          |
| updated_at      | TIMESTAMP | Last updated timestamp                     |

### Link Analytics Table

| Column     | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | UUID      | Primary key                 |
| link_id    | UUID      | References links (FK)       |
| profile_id | UUID      | References profiles (FK)    |
| event_type | TEXT      | Event type (click/download) |
| ip_address | TEXT      | Visitor IP (optional)       |
| user_agent | TEXT      | Browser user agent          |
| referrer   | TEXT      | Referrer URL                |
| created_at | TIMESTAMP | Event timestamp             |

## Row Level Security (RLS) Policies

The database uses RLS to secure data access:

### Profiles

- ✅ Anyone can **read** profiles (public)
- ✅ Users can **create** their own profile
- ✅ Users can **update** their own profile
- ✅ Users can **delete** their own profile

### Links

- ✅ Anyone can **read** links (public)
- ✅ Profile owners can **create** links
- ✅ Profile owners can **update** their links
- ✅ Profile owners can **delete** their links

### Analytics

- ✅ Anyone can **insert** analytics (for tracking)
- ✅ Profile owners can **read** their own analytics

## Automatic Features

### Profile Auto-Creation

When a user signs up, a profile is automatically created with:

- Username: Derived from email (before @)
- Display name: Full name from OAuth or email username
- Description: Default welcome message

This is handled by the `handle_new_user()` function and trigger.

### Automatic Timestamps

The `updated_at` field is automatically updated whenever a record is modified. This is handled by the `update_updated_at_column()` function and triggers.

## Troubleshooting

### "relation does not exist" error

The tables haven't been created yet. Run the schema SQL again.

### "permission denied for table" error

RLS policies might not be set up correctly. Check that the policies exist:

```sql
SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'links', 'link_analytics');
```

### Profile not created on signup

Check that the trigger exists:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If it doesn't exist, run the schema SQL again.

### Username already exists error

Each username must be unique. Try a different username or check existing profiles:

```sql
SELECT username FROM profiles;
```

### Cannot update/delete profile or links

Ensure you're logged in and the profile belongs to your user account. Check:

```sql
SELECT user_id FROM profiles WHERE id = 'your-profile-id';
```

## Advanced Configuration

### Enable Realtime Updates (Optional)

To get real-time updates when data changes:

1. Go to **Database** > **Replication**
2. Enable replication for tables:
   - `profiles`
   - `links`
   - `link_analytics`

### Add Database Indexes (Already included)

The schema includes indexes for better performance:

- Profile username lookup
- User ID to profile mapping
- Link position ordering
- Analytics queries

### Backup Your Database

1. Go to **Settings** > **Database**
2. Click **Create backup**
3. Schedule automatic backups for production

## Data Migration

### Importing Existing Data

If you have existing profile data, you can import it:

```sql
-- Example: Insert a profile
INSERT INTO profiles (user_id, username, display_name, description)
VALUES (
  'user-uuid-here',
  'johndoe',
  'John Doe',
  'Software Developer'
);

-- Example: Insert links for a profile
INSERT INTO links (profile_id, title, url, platform, category, position)
VALUES
  ('profile-uuid-here', 'Twitter', 'https://twitter.com/johndoe', 'twitter', 'social', 0),
  ('profile-uuid-here', 'GitHub', 'https://github.com/johndoe', 'github', 'social', 1);
```

### Exporting Data

```sql
-- Export all profiles
SELECT * FROM profiles;

-- Export all links
SELECT * FROM links;

-- Export analytics
SELECT * FROM link_analytics WHERE created_at > '2024-01-01';
```

## Production Checklist

Before deploying to production:

- [ ] Database schema is deployed
- [ ] RLS policies are active and tested
- [ ] Indexes are created
- [ ] Automatic backups are enabled
- [ ] Connection pooling is configured (for high traffic)
- [ ] Database logs are being monitored
- [ ] Rate limiting is configured
- [ ] Analytics retention policy is set

## Performance Tips

1. **Use connection pooling** for production applications
2. **Monitor slow queries** in the Supabase dashboard
3. **Set up database indexes** for frequently queried fields
4. **Archive old analytics** data periodically
5. **Use Supabase caching** for public profiles

## Related Documentation

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Triggers & Functions](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Need Help?

- Check the [Supabase Discord](https://discord.supabase.com)
- Review [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)
- Consult the [PostgreSQL documentation](https://www.postgresql.org/docs/)
