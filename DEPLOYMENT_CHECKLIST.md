# Quick Deployment Checklist

## Before Deploying to Production

### 1. Update Environment Variables

In your Vercel/hosting dashboard, set:

```env
NEXT_PUBLIC_SITE_URL=https://linkin.one
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

⚠️ **Important**: Remove any `http://localhost:3000` references!

### 2. Build and Test Locally

```bash
pnpm build
pnpm start
```

Visit `http://localhost:3000` and test:
- Share button works
- OG images generate
- Sitemap loads

### 3. Deploy

```bash
git add .
git commit -m "Add share button and fix OG images"
git push origin main
```

### 4. After Deployment

#### A. Clear Social Media Cache

**Facebook Debugger**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://linkin.one/YOUR_USERNAME`
3. Click "Scrape Again"

**Twitter Card Validator**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter: `https://linkin.one/YOUR_USERNAME`
3. Preview card

**LinkedIn Post Inspector**
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter: `https://linkin.one/YOUR_USERNAME`
3. Check preview

#### B. Test Features

✅ Visit profile: `https://linkin.one/YOUR_USERNAME`
✅ Click share button - modal opens
✅ Test each social platform button
✅ Copy link works
✅ View sitemap: `https://linkin.one/sitemap.xml`
✅ Check OG image: `https://linkin.one/api/og?username=YOUR_USERNAME`

#### C. Submit Sitemap to Search Engines

**Google Search Console**
1. Go to: https://search.google.com/search-console
2. Select your property
3. Go to Sitemaps
4. Submit: `https://linkin.one/sitemap.xml`

**Bing Webmaster Tools**
1. Go to: https://www.bing.com/webmasters
2. Add/select your site
3. Submit sitemap

---

## Common Issues & Fixes

### Issue: OG images show old content
**Fix**: Clear cache using Facebook Debugger

### Issue: Share modal doesn't open
**Fix**: Check browser console, ensure no JS errors

### Issue: Sitemap shows 404
**Fix**: Restart server, check Supabase connection

### Issue: Copy button doesn't work
**Fix**: Ensure HTTPS (required for clipboard API)

---

## Verification URLs

After deployment, test these:

```
Main Site:
https://linkin.one

Your Profile:
https://linkin.one/YOUR_USERNAME

Profile OG Image:
https://linkin.one/api/og?username=YOUR_USERNAME

Platform OG Image:
https://linkin.one/api/og/platform?username=YOUR_USERNAME&platform=linkedin

Sitemap:
https://linkin.one/sitemap.xml
```

---

## Success Indicators

✅ Share button appears on profiles
✅ All social share links work
✅ OG images load and show correct data
✅ Facebook preview shows image
✅ Twitter preview shows card
✅ LinkedIn preview shows image
✅ WhatsApp preview shows image
✅ Sitemap returns valid XML
✅ No console errors
✅ Mobile responsive works

---

## Analytics (Optional)

Track share button clicks by adding analytics:

```typescript
// In share-profile-dialog.tsx
const handleShare = (getUrl: (url: string, text: string) => string) => {
  // Track event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      method: platform.name,
      content_type: 'profile',
      content_id: username
    });
  }
  
  const shareUrl = getUrl(profileUrl, shareText);
  window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
};
```

---

Good luck with your deployment! 🚀
