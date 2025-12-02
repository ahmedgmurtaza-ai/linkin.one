# Feedback System Setup

This document explains the feedback system and how to set it up.

## Features

1. **Feedback Widget**: A floating button in the bottom right corner of all pages that allows users to quickly submit feedback.
2. **Feedback Page**: A dedicated page at `/feedback` for users to submit detailed feedback.
3. **Feedback Types**: Support for suggestions, bug reports, feature requests, compliments, and other feedback.
4. **Optional Email**: Users can optionally provide their email for follow-up.

## Database Setup

### Running the Migration

To set up the feedback table in your Supabase database, run the migration file:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Studio
```

The migration file is located at: `supabase/migrations/20251130_create_feedback_table.sql`

### Manual Setup (Alternative)

If you prefer to manually create the table, you can copy and paste the following SQL in Supabase Studio:

```sql
-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
```

## Viewing Feedback

You can view submitted feedback in your Supabase dashboard:

1. Go to your Supabase project
2. Navigate to Table Editor
3. Select the `feedback` table
4. View all submitted feedback entries

## Feedback Widget

The feedback widget is automatically included in all pages via the root layout. It appears as a floating message icon in the bottom right corner.

### Customization

To customize the widget appearance or behavior, edit:
- `components/feedback/feedback-widget.tsx`

## Pages

### Feedback Page
- **URL**: `/feedback`
- **Description**: Dedicated page for submitting feedback with a full form

### Changelog Page
- **URL**: `/changelog`
- **Description**: Shows version history and updates
- **Note**: Reads from `CHANGELOG.md` file for easy updates
- **Format**: Follows standard changelog format with version headers and change categories

### Privacy Policy Page
- **URL**: `/privacy`
- **Description**: Privacy policy and data handling information

### Terms of Service Page
- **URL**: `/terms`
- **Description**: Terms and conditions for using the service

## Updating the Changelog

To add new entries to the changelog, edit the `CHANGELOG.md` file in the root directory:

```markdown
## [1.2.0] - 2025-12-01

### Added
- New feature description

### Fixed
- Bug fix description

### Improved
- Improvement description
```

Supported change categories:
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security updates
- **Improved**: Performance or UX improvements

## API Endpoint

The feedback submission uses the API endpoint:
- **Endpoint**: `/api/feedback`
- **Method**: POST
- **Body**: 
  ```json
  {
    "type": "suggestion",
    "email": "user@example.com",
    "message": "Your feedback message"
  }
  ```

## Components

1. **FeedbackWidget** (`components/feedback/feedback-widget.tsx`)
   - Floating button with dialog
   - Quick feedback submission

2. **FeedbackForm** (`components/feedback/feedback-form.tsx`)
   - Full feedback form
   - Used on the dedicated feedback page

3. **Footer** (`components/footer.tsx`)
   - Site footer with links to feedback, changelog, privacy, and terms

## Notes

- All pages are fully responsive and support dark/light themes
- The feedback system integrates with your existing Supabase setup
- Feedback is stored securely in your database
- Email field is optional for anonymous feedback
