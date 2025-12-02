to build linkin.one. It’s strict about scope (MVP only), technology choices, file/routes structure, DB schema, API contract, UX flows, and operational tooling. This document is the single source of truth: the agent must not add features or make assumptions beyond what’s written here.

1 — High-level goals (MVP)

Provide a simple, reliable “one link” profile creator with three profile categories and platform links.

Real-time mobile-preview while editing.

Ability to reorder links by drag-and-drop.

Display profile public page plus top bar with shareable profile link and downloadable QR code.

Admin/owner dashboard for editing profile (profile name, description, thumbnail, list of links).

Use specified frontend stack: Next.js, Tailwind CSS, Joy UI (MUI Joy).

Minimal, maintainable codebase designed for iterative expansion later (post-MVP features are listed separately and must not be implemented for MVP).

2 — Scope rules & agent instructions (must-follow)

Single source of truth: this document is authoritative. Do not add or assume features not listed here. If a decision is required and not specified, implement the simplest possible choice and document it as “decision made” in a short commit message.

No emojis anywhere in UI text, messages, or code comments pushed to production.

MVP-only: do not implement post-MVP add-ons (analytics, custom domains, paid removals, shortener, follower system).

Files & routes: the agent may create new files and routes. When creating a new route, add it to the “Routes manifest” file (see structure below).

Code quality: meaningful commit messages, one feature per branch, PRs for main merges, and unit tests for major logic.

Accessibility: ensure keyboard navigation for drag/drop and alt text for images.

Secrets: store all secrets in environment variables and never commit them.

Document decisions in a DECISIONS.md file at repo root when agent chooses defaults.

3 — Tech stack (explicit)

Frontend: Next.js (app router), Tailwind CSS, Joy UI (MUI Joy v6) for dashboard components. Use Tailwind for layout + utility classes, Joy UI for form controls, cards, dialogs in the dashboard.

Drag & drop: dnd-kit (recommended) for accessibility and modern support.

QR generation: server-side or client QR generation via qrcode or qrcode.react; provide a download button that triggers file download.

AI description modification: a server API route calling an external model (placeholder interface for OpenAI-style API). The API route must accept the raw user description and return a modified description. The implementation must be abstracted so provider can be swapped.

Auth and storage/DB: Supabase (Postgres + Auth + Storage) — chosen to speed MVP (auth, DB, and storage in one service). The agent should implement with Supabase SDK (server and client). If supabase is not acceptable, fallback plan is Postgres + NextAuth + S3.

File uploads (avatar/thumbnail): Supabase Storage (or S3 if Supabase not available).

Payment and billing: Stripe (post-MVP; do not implement now).

Hosting / CI/CD: Vercel (preferred for Next.js) with GitHub Actions CI or use Vercel’s GitHub integration.

Testing: Jest + React Testing Library, end-to-end tests with Playwright or Cypress (choose one; add config but keep tests minimal for MVP).

Linting & formatting: ESLint, Prettier, and TypeScript (strongly recommended). Use TypeScript throughout.

Package manager: pnpm (recommended) or npm.

4 — MVP feature list (developer tasks)

Sign up / Sign in

Email-based auth (magic link) via Supabase Auth. Optional OAuth providers may be stubbed but not required.

Profile creation flow

Ask profile category: business, creator, other.

Ask which platforms to add (render selectable list). Pre-populated platform list (see Platforms list below).

For chosen platforms, show input components to add URLs or usernames.

Allow user to set: profile name, short description, thumbnail (upload).

Provide an “improve description” button that calls AI description API route and updates description.

Dashboard

Left panel: link list editor (add / edit / delete link entries).

Right panel: live mobile preview (mirrors current state).

Drag-and-drop to reorder links (persist order).

Top bar: public profile link, QR code (downloadable).

“Save”/“Publish” actions persist to DB.

Public profile page

Vanity route: /[username] 

Display profile thumbnail, name, description, and the ordered list of platform links (buttons).

QR icon/button near top to download QR.

Platform presets

Provide preset platforms list with icons and input validation types (url, username, text):

Examples: Website, LinkedIn, Twitter/X, Instagram, Facebook, YouTube, GitHub, Email, Phone, WhatsApp, Telegram, Resume (pdf), Custom link

For MVP, icons are the default icons; custom icon upload is post-MVP.

Thumbnail upload

Allow user to upload an image; store in Supabase storage; show in preview.

Basic validation and UX

Required fields: profile name; at least one link.

Nice-to-have: friendly error messages, inline validation.

Routes and APIs

RESTful API routes under /api/* using Next.js route handlers for server-side actions (detailed below).

All me routes require auth. Public profile routes are open.

7 — Frontend file & route structure (recommended)

Use Next.js app router. Provide a ROUTES_MANIFEST.md updated by agent when new routes are added.

/app
  /layout.tsx
  /page.tsx                -> Marketing / landing
  /signup
    /page.tsx
  /signin
    /page.tsx
  /dashboard
    /layout.tsx
    /page.tsx             -> redirect to first profile editor or create
      /components
        LinkList.tsx
        LinkEditor.tsx
        MobilePreview.tsx
        ProfileSettings.tsx
  /[username]
    /page.tsx           -> public profile page
  /api
    /auth
      route handlers...
    /me
      /profile
        route handlers...
    /profile
      /[username]
        route handlers...
/components
  Header.tsx
  Footer.tsx
  Modal.tsx
/lib
  supabaseClient.ts
  aiClient.ts            -> wrapper to call AI provider
  qr.ts                  -> qr generation helper
/styles
  globals.css            -> Tailwind base
/tests
  unit and e2e tests
/QWEN.md
/agent_instructions
  /DECISIONS.md
  /ROUTES_MANIFEST.md


Agent must create and update ROUTES_MANIFEST.md showing route path, purpose, and files created.

8 — UI component list & responsibilities

LinkList — lists links; supports drag-and-drop; each item shows platform icon, label, edit/delete handles.

LinkEditor — inline editor for a link; fields: label, value, platform selector.

MobilePreview — renders the public profile phone-like mock; listens to editor state and updates live.

ProfileSettings — name, description, thumbnail upload, category selector, username slug editor.

TopBar — profile link, QR download button, publish/save actions.

PlatformPicker — grid of platform buttons to add platforms during onboarding.

Toast — generic toast system for success/error feedback.

ConfirmDialog — confirm deletions.

Design rules:

Use Joy UI components for forms, dialogs, and cards.

Use Tailwind for layout / responsive utilities.

Maintain a small, consistent design token set: spacing, typography scale, rounded corners. Keep theme variables in tailwind.config.js and a theme.tsx for Joy UI theme integration.

9 — UX flows (concise)

Onboarding

User visits /signup → signs up via email magic link → redirected to /dashboard.

Prompt: choose category → choose platforms → fill platform inputs → set name & thumbnail → click “Publish”.

Editing

Dashboard shows left editor + right preview.

Edits auto-save draft locally and show Save button to persist.

Drag/drop to reorder — persists order on drop.

Public

Visit /[username] to view profile; clicking a link opens the value (external link or deep link).

QR button downloads PNG of profile URL QR.

Improve description

Clicking “Improve description” sends current description to gemini api  and replaces field with result; show undo option.

10 — Platform list (MVP defaults)

Website

LinkedIn

Twitter/X

Instagram

Facebook

YouTube

GitHub

Email

Phone

WhatsApp

Telegram

Resume (file upload)

Custom link


22 — Final agent instructions (copy into agent prompt)

Use this document as the single source of truth. You must not add or assume features beyond what's described. Implement the MVP features only. Use Next.js (app router), TypeScript, Tailwind, and Joy UI. Follow naming, file structure, and API contracts above. Create or update ROUTES_MANIFEST.md and DECISIONS.md for any new routes or decisions. Use Supabase for auth, DB, and storage. No emojis. Keep code modular and well-tested. Write clear commit messages. When creating new files, include their routes and a short purpose entry in ROUTES_MANIFEST.md. If you encounter ambiguity you cannot resolve, document the chosen default in DECISIONS.md and proceed with the simplest option.

---

## 23 — Documentation Index (December 2, 2025)

### Parent Document
This QWEN.md file serves as the **parent documentation** and single source of truth for all project documentation. All other documentation files are linked here for reference.

### Feature Documentation

#### Share Button & OG Image Implementation
- **File**: [`SHARE_AND_OG_FIX.md`](./SHARE_AND_OG_FIX.md)
- **Purpose**: Complete documentation for the social sharing feature and OG image fix
- **Contents**:
  - Share button implementation with 8 social platforms
  - OG image generation fix for edge runtime
  - Sitemap verification
  - Technical details and design specifications
  - Troubleshooting guide

#### Testing Procedures
- **File**: [`TESTING_GUIDE.md`](./TESTING_GUIDE.md)
- **Purpose**: Step-by-step testing instructions for share and OG features
- **Contents**:
  - Local testing procedures
  - Production testing steps
  - Social media debugger tools
  - Expected results and success criteria
  - Performance benchmarks

#### Deployment Process
- **File**: [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
- **Purpose**: Quick reference for deploying new features to production
- **Contents**:
  - Pre-deployment checklist
  - Environment variable configuration
  - Post-deployment verification
  - Common issues and fixes
  - Verification URLs

### Quick Reference Summary

#### Recent Features (December 2, 2025)
1. **Share Button**: Icon-only button with modal for sharing profiles on 8 social networks (LinkedIn, Facebook, X/Twitter, WhatsApp, Messenger, Snapchat, TikTok, Email)
2. **OG Image Fix**: Fixed Open Graph images by implementing edge runtime with direct Supabase REST API calls
3. **Sitemap**: Verified working correctly at `/sitemap.xml` with all profiles and platform pages

#### Key Files Modified
- `components/share-profile-dialog.tsx` (NEW)
- `components/profile-top-bar.tsx`
- `app/[username]/page.tsx`
- `app/api/og/route.tsx`
- `app/api/og/platform/route.tsx`
- `app/[username]/[platform]/page.tsx`

#### Environment Variables Required
```env
NEXT_PUBLIC_SITE_URL=https://linkin.one
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Documentation Guidelines

When adding new features or documentation:
1. **Always link** new documentation files in this section
2. Provide a **brief purpose** statement
3. List **key contents** for quick reference
4. Update the **Quick Reference Summary** if major features are added
5. Keep this QWEN.md as the **single entry point** for all documentation

---

## 24 — Future Documentation

As new features are added, link documentation here following this format:

#### Feature Name
- **File**: [`FILENAME.md`](./FILENAME.md)
- **Purpose**: Brief description
- **Contents**: Key topics covered

This ensures all team members know where to find documentation and maintains QWEN.md as the parent document.