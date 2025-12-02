# Testing Guide for Share Button & OG Images

## Quick Test Steps

### 1. Test Share Button

#### Start Dev Server
```bash
pnpm dev
```

#### Navigate to a Profile
```
http://localhost:3000/YOUR_USERNAME
```

#### Click Share Button
- Look for the **Share icon** (top-left corner)
- Should be next to the Dashboard button (if logged in)
- Click it to open the modal

#### Test Modal Features
- ✅ Profile preview card shows
- ✅ Avatar/name/username display correctly
- ✅ 8 social buttons are visible in a 4-column grid
- ✅ Click each social button - opens new window with correct URL
- ✅ Copy link button works - shows "Copied" feedback
- ✅ If not logged in, see "Sign Up Free" and "Find Out More" buttons

### 2. Test OG Images

#### Test in Browser
Navigate to:
```
http://localhost:3000/api/og?username=YOUR_USERNAME
```
You should see a beautiful 1200x630 image with:
- Purple gradient background
- Your profile picture
- Your name and username
- Your bio
- Link count

#### Test Platform-Specific OG Image
Navigate to:
```
http://localhost:3000/api/og/platform?username=YOUR_USERNAME&platform=linkedin
```
You should see an image with:
- Your profile info on the left
- LinkedIn badge on the right
- Purple gradient background

### 3. Test Social Sharing

#### Using Facebook Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your profile URL: `http://localhost:3000/YOUR_USERNAME`
3. Click "Debug"
4. Should see your OG image, title, and description

**Note**: For localhost testing, Facebook won't load images. You'll need to deploy to a public URL.

#### Using Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your profile URL
3. Should preview the card (requires public URL)

#### Quick Test with Meta Tags
View page source (Ctrl+U) on your profile page and verify:
```html
<meta property="og:image" content="https://linkin.one/api/og?username=YOUR_USERNAME" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://linkin.one/api/og?username=YOUR_USERNAME" />
```

### 4. Test Sitemap

#### View Sitemap
Navigate to:
```
http://localhost:3000/sitemap.xml
```

Should see XML output with:
- Static pages (home, register, login, etc.)
- All user profiles
- All platform-specific links
- Last modified dates
- Priorities

#### Check Sitemap Structure
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://linkin.one</loc>
    <lastmod>2025-12-02T...</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://linkin.one/username</loc>
    <lastmod>2025-12-02T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ...
</urlset>
```

### 5. Production Testing (After Deploy)

#### Test Real Sharing
1. Deploy to production (Vercel, etc.)
2. Get your profile URL: `https://linkin.one/YOUR_USERNAME`
3. Share on:
   - **Facebook**: Paste URL in status update
   - **Twitter/X**: Tweet the URL
   - **LinkedIn**: Share in a post
   - **WhatsApp**: Send to a friend
   - **Slack**: Paste in a channel

#### Verify OG Images Load
All platforms should show:
- ✅ Profile image preview
- ✅ Title: "Your Name (@username) | linkin.one"
- ✅ Description: Your bio
- ✅ 1200x630 image

#### Clear Social Media Cache
If images don't show after deploy:
- **Facebook**: https://developers.facebook.com/tools/debug/ → "Scrape Again"
- **Twitter**: Wait ~30 minutes or contact support
- **LinkedIn**: Usually auto-updates within minutes

---

## Environment Variables Check

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or https://linkin.one in production
```

For production (Vercel):
1. Go to your Vercel project settings
2. Add environment variables
3. Redeploy

---

## Troubleshooting

### Share Button Doesn't Appear
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### OG Images Return 404
- Check username exists in database
- Verify Supabase credentials
- Check browser network tab for API errors

### Social Platforms Don't Show Preview
- Ensure using HTTPS in production
- Wait 5-10 minutes for cache
- Use platform debuggers to force refresh
- Check that `NEXT_PUBLIC_SITE_URL` is set correctly

### Copy Button Doesn't Work
- Check browser console for errors
- Ensure HTTPS (clipboard API requires secure context)
- Test in different browser

---

## Expected Results

### Share Modal Appearance
```
┌─────────────────────────────────┐
│  Share Profile                  │
│  Share this profile with your   │
│  network                        │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ [Avatar] John Doe       │   │
│  │          @johndoe       │   │
│  │          My bio here... │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  [💼] [👤] [✖️] [💚]           │
│  [💬] [👻] [🎵] [✉️]           │
├─────────────────────────────────┤
│  [linkin.one/johndoe]  [Copy]  │
├─────────────────────────────────┤
│  Create your own profile        │
│  [Sign Up Free] [Find Out More] │
└─────────────────────────────────┘
```

### OG Image Appearance
```
┌─────────────────────────────────────────┐
│  Purple Gradient Background             │
│  ┌───────────────────────────────────┐  │
│  │  White Card                       │  │
│  │  [Avatar Image]                   │  │
│  │  John Doe                         │  │
│  │  @johndoe                         │  │
│  │  Software Developer & Creator    │  │
│  │  🔗 12 links    linkin.one       │  │
│  └───────────────────────────────────┘  │
│                  linkin.one/johndoe     │
└─────────────────────────────────────────┘
```

---

## Success Criteria

✅ Share button visible on all profile pages
✅ Modal opens smoothly with no errors
✅ All 8 social platforms have working share URLs
✅ Copy link button works and shows feedback
✅ CTAs show for non-logged-in users
✅ OG images generate without errors
✅ OG images show correct profile data
✅ Platform OG images work for all platforms
✅ Sitemap loads and includes all profiles
✅ Social media previews show correctly (in production)

---

## Performance Notes

- **OG Image Generation**: ~200-500ms per image
- **Edge Runtime**: Runs globally, low latency
- **Caching**: OG images are cached by social platforms
- **Sitemap**: Regenerates every hour
- **Share Modal**: Instant loading, no network requests

---

Happy Testing! 🚀
