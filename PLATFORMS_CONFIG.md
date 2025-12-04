# Platforms Configuration

This project uses a centralized configuration system for managing platform data, categories, and their visual properties.

## Overview

The platform configuration is stored in `lib/platforms-config.json` and provides a single source of truth for:
- Platform definitions (colors, icons, placeholders)
- Category groupings
- URL patterns for platform detection

## File Structure

### Configuration Files
- **`lib/platforms-config.json`** - The main configuration file containing all platform and category data
- **`lib/platforms-config.ts`** - TypeScript utilities and helper functions for accessing the config

## Usage

### Importing the Config

```typescript
import {
  getAllPlatforms,
  getAllCategories,
  getPlatformById,
  getPlatformsByCategory,
  getPlatformColor,
  detectPlatformFromUrl
} from "@/lib/platforms-config";
```

### Getting All Platforms

```typescript
const platforms = getAllPlatforms();
// Returns array of all platform objects
```

### Getting All Categories

```typescript
const categories = getAllCategories();
// Returns array of all category objects
```

### Getting a Specific Platform

```typescript
const twitter = getPlatformById("twitter");
// Returns: { id: "twitter", title: "Twitter", color: "#1DA1F2", ... }
```

### Getting Platforms by Category

```typescript
const socialPlatforms = getPlatformsByCategory("social");
// Returns all platforms in the "social" category
```

### Getting Platform Colors

```typescript
const colors = getPlatformColor("twitter");
// Returns: { color: "#1DA1F2", textColor: "#FFFFFF" }
```

### Detecting Platform from URL

```typescript
const platform = detectPlatformFromUrl("https://twitter.com/user");
// Returns the Twitter platform object
```

## Adding a New Platform

To add a new platform, edit `lib/platforms-config.json`:

```json
{
  "id": "newplatform",
  "title": "New Platform",
  "category": "social",
  "color": "#FF0000",
  "textColor": "#FFFFFF",
  "icon": "newplatform",
  "urlPattern": "newplatform.com",
  "placeholder": "https://newplatform.com/username"
}
```

### Platform Object Properties

- **`id`** (required): Unique identifier for the platform
- **`title`** (required): Display name
- **`category`** (required): Category ID (must match a category in the config)
- **`color`** (required): Hex color code for the platform's brand color
- **`textColor`** (required): Text color (usually "#FFFFFF" or "#000000")
- **`icon`** (required): Icon identifier (must match an icon in platform-icon.tsx)
- **`gradient`** (optional): CSS gradient string for platforms with gradient branding
- **`urlPattern`** (optional): URL pattern for detecting the platform from URLs
- **`placeholder`** (required): Placeholder text for URL input

## Adding a New Category

To add a new category, edit the `categories` array in `lib/platforms-config.json`:

```json
{
  "id": "mycategory",
  "title": "My Category",
  "description": "Description of the category"
}
```

## Components Using the Config

### Link Card
The `LinkCard` component uses platform colors to tint the background of each link card:

```typescript
import { getPlatformColor } from "@/lib/platforms-config";

const platformColor = getPlatformColor(link.platform);
const cardStyle = {
  backgroundColor: `${platformColor.color}15` // 15 = ~9% opacity
};
```

### Platform Icon
The `PlatformIcon` component uses the color configuration:

```typescript
import { PLATFORM_COLORS } from "@/lib/platforms-config";

const colors = PLATFORM_COLORS[platform.toLowerCase()];
```

### Link Editor
The `LinkEditor` component displays platforms grouped by category in the dropdown:

```typescript
import { getAllCategories, getAllPlatforms } from "@/lib/platforms-config";

// In the platform select dropdown
getAllCategories().map((cat) => {
  const platformsInCategory = getAllPlatforms().filter(
    p => p.category === cat.id
  );
  // Render category header and platforms
});
```

## Categories

The configuration includes the following default categories:

- **Social Media** - Twitter, Instagram, Facebook, TikTok
- **Professional** - LinkedIn, GitHub, Dev.to
- **Content & Media** - YouTube, Medium, Substack
- **Communication** - Email, WhatsApp, Telegram, Discord
- **Music & Audio** - Spotify, SoundCloud
- **Design & Creative** - Dribbble, Behance
- **Live Streaming** - Twitch
- **Documents & Files** - Resume, PDF
- **Other** - Website, Custom Links

## Benefits

✅ **Single Source of Truth** - All platform data in one place
✅ **Easy to Extend** - Add new platforms by editing JSON
✅ **Type Safety** - TypeScript interfaces ensure correct usage
✅ **Consistent Branding** - Colors and icons managed centrally
✅ **Better UX** - Categorized dropdowns for easier platform selection
✅ **Maintainable** - No need to update multiple files when adding platforms
