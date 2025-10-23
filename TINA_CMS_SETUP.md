# Tina CMS Migration Guide

## What's Been Done

### 1. Dependencies Installed
- `tinacms@^2.9.0` - Core Tina CMS
- `@tinacms/cli@^1.11.0` - CLI tools for development
- `@tinacms/datalayer@^1.4.1` - Content layer (dev dependency)
- `@astrojs/react@^3.6.3` - React integration for visual editing
- `react@^18.3.1` & `react-dom@^18.3.1` - React libraries

### 2. Configuration Created
- `.tina/config.ts` - Complete schema matching your existing content structure
- `package.json` - Updated scripts:
  - `npm run dev` - Now runs Tina admin + Astro dev server
  - `npm run build` - Builds Tina schema + Astro site
- `astro.config.mjs` - Added React integration for Tina's visual editor

### 3. Content Collections Configured

The Tina schema mirrors your existing structure:

#### Homepage
- **Homepage - Hero** (`src/content/homepage/hero.json`)
- **Homepage - Content** (`src/content/homepage/content.json`) - about, equipment, CTA, reviews
- **Homepage - Services Showcase** (`src/content/homepage/services-showcase.json`)

#### Content
- **Services** (`src/content/services/*.md`) - 8 markdown files
- **Blog Posts** (`src/content/blog/*.md`)
- **Testimonials** (`src/content/testimonials/*.md`)

#### Pages & Settings
- **Pages** (`src/content/pages/*.json`)
- **Settings** (`src/data/settings.json`) - Site-wide configuration

---

## Next Steps: Setting Up Tina Cloud

### Option 1: Use Tina Cloud (Recommended)

**Why Tina Cloud?**
- Hosted admin UI (no need to run dev server to edit content)
- 2 free users (perfect for your team)
- Automatic Git integration
- Built-in authentication
- Works with Cloudflare Polish optimization

**Setup Steps:**

1. **Create Tina Cloud Account**
   - Go to: https://app.tina.io/register
   - Sign up with your GitHub account (same one that owns `lakecountyoutodoor/lco-astro`)

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Import from Git"**
   - Choose repository: `lakecountyoutodoor/lco-astro`
   - Select branch: `feature/tina-cms-migration` (or `main` after merge)

3. **Get Tina Tokens**
   After creating the project, you'll see:
   - **Client ID** (starts with a long alphanumeric string)
   - **Token** (click "Create new token")

   Copy both of these!

4. **Add to Cloudflare Pages Environment Variables**
   - Go to: https://dash.cloudflare.com/
   - Navigate to: **Workers & Pages** → **lco-astro**
   - Go to: **Settings** → **Environment variables**
   - Add these variables for **Production** environment:
     ```
     TINA_CLIENT_ID=[your client ID from step 3]
     TINA_TOKEN=[your token from step 3]
     ```

5. **Add to Local Development**
   Create a `.env` file in your project root:
   ```bash
   TINA_CLIENT_ID=your_client_id_here
   TINA_TOKEN=your_token_here
   ```

   **IMPORTANT:** `.env` is already in `.gitignore` - never commit this file!

6. **Update Tina Config with Your Client ID**
   - Open `.tina/config.ts`
   - Replace:
     ```typescript
     clientId: process.env.TINA_CLIENT_ID,
     token: process.env.TINA_TOKEN,
     ```
   - With your actual client ID (or keep as env vars - both work)

---

### Option 2: Local-Only Mode (No Tina Cloud)

If you want to test locally first without Tina Cloud:

1. **Temporarily remove these lines from `.tina/config.ts`:**
   ```typescript
   clientId: process.env.TINA_CLIENT_ID,
   token: process.env.TINA_TOKEN,
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```

3. **Access local admin:**
   - Go to: `http://localhost:4321/admin/index.html`
   - You'll see the Tina admin UI
   - Changes will be saved directly to your local files
   - **WARNING:** Local mode doesn't work in production/Cloudflare - Tina Cloud required for prod!

---

## Testing the Migration

### Local Development Test

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Verify Tina starts:**
   You should see:
   ```
   Tina CMS is running at http://localhost:4321/admin
   Astro dev server is running...
   ```

3. **Open admin:**
   - Go to: `http://localhost:4321/admin/index.html`
   - If using Tina Cloud: Click "Login" → Authorize with GitHub
   - If local-only: Admin loads directly

4. **Test each collection:**
   - Homepage → Hero: Try editing title
   - Services: Open a service, edit description
   - Blog: Create a new blog post
   - Save and check that files update in `src/content/`

5. **Verify site updates:**
   - Go to: `http://localhost:4321`
   - Check that your edits appear on the actual site

### Build Test

```bash
npm run build
```

Should complete without errors. Tina will:
1. Generate GraphQL schema
2. Build admin interface to `public/admin/`
3. Run Astro build

---

## Cloudflare Pro Optimizations

### Image Handling with Tina + Polish

**How it works:**
1. Upload images through Tina admin
2. Images saved to `public/images/` (as configured in Tina)
3. Astro's Sharp service outputs JPG at quality 90
4. Cloudflare Polish converts JPG → WebP/AVIF on-the-fly
5. Browsers get optimized images automatically

**No changes needed** - your current Astro config already does this!

### Argo Smart Routing (Optional)

For 30% faster CMS loads:

1. Go to: Cloudflare Dashboard → Network
2. Enable **Argo Smart Routing**
3. Cost: $5/month + $0.10/GB (minimal for CMS traffic)
4. Benefit: Tina admin loads faster, better for remote editors

---

## Migrating Existing Decap CMS Users

### Authentication Changes

**Decap CMS:**
- Used GitHub OAuth with Cloudflare Functions
- Required: `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET`

**Tina CMS:**
- Uses Tina Cloud for auth
- Required: `TINA_CLIENT_ID` + `TINA_TOKEN`
- Also uses GitHub for identity, but managed by Tina

### Access Control

**Tina Cloud Free Tier:** 2 users

If you need more users:
- Upgrade to Tina Cloud Team plan ($29/month for 5 users)
- Or stay on free tier and share login (not recommended for teams)

---

## After Migration is Complete

### Cleanup (Do this last, after verifying everything works!)

1. **Remove Decap CMS files:**
   ```bash
   rm -rf public/admin/config.yml
   rm -rf public/admin/index.html (if not using Tina's)
   rm -rf functions/api/auth.js
   rm -rf functions/api/auth/callback.js
   ```

2. **Remove Cloudflare environment variables:**
   - Delete `GITHUB_CLIENT_ID`
   - Delete `GITHUB_CLIENT_SECRET`

3. **Remove GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - Delete "Lake County Outdoors CMS" OAuth app

---

## Troubleshooting

### "Tina config not found"
**Problem:** `.tina/config.ts` not being read
**Solution:** Make sure you're running `npm run dev` (not `npm run dev:astro`)

### "GraphQL schema error"
**Problem:** Tina can't find your content files
**Solution:** Check paths in `.tina/config.ts` match your actual file structure

### "Authentication failed"
**Problem:** Tina Cloud tokens not set
**Solution:**
1. Check `.env` file has correct `TINA_CLIENT_ID` and `TINA_TOKEN`
2. Check Cloudflare Pages has env vars set for production

### Images not optimizing
**Problem:** Cloudflare Polish not converting images
**Solution:**
1. Verify Polish is enabled in Cloudflare dashboard
2. Check images are JPG (not WebP) from Astro build
3. Polish only works on production domain (not `*.pages.dev` preview URLs)

### Build fails on Cloudflare
**Problem:** Tina build step failing
**Solution:**
1. Ensure env vars are set in Cloudflare for Production environment
2. Check build logs for specific error
3. May need to add `TINA_CLIENT_ID` and `TINA_TOKEN` to Build environment (not just Production)

---

## Key Differences: Decap vs Tina

| Feature | Decap CMS | Tina CMS |
|---------|-----------|----------|
| **Editing** | Sidebar forms only | Visual + sidebar (contextual editing) |
| **Schema** | Manual YAML config | TypeScript auto-generated |
| **Auth** | GitHub OAuth (DIY) | Tina Cloud (managed) |
| **Sync** | One-way (CMS → Git) | One-way (CMS → Git) but schema auto-updates |
| **Preview** | Separate preview pane | Live on-page preview |
| **Cost** | Free (self-hosted auth) | Free for 2 users, $29/mo for 5 |
| **Setup** | Complex OAuth setup | 5-minute Tina Cloud signup |
| **UX** | Functional but dated | Modern, intuitive |

---

## Questions?

If you run into issues:

1. Check the Tina CMS docs: https://tina.io/docs/
2. Review this file's troubleshooting section
3. Check `.tina/config.ts` for typos or path mismatches
4. Verify environment variables are set correctly

---

## Summary

You now have:
- ✅ Tina CMS dependencies installed
- ✅ Complete schema configured matching existing content
- ✅ React integration for visual editing
- ✅ Cloudflare Polish-compatible image handling
- ✅ Dev server ready to run

**Next:** Follow "Setting Up Tina Cloud" above to get authentication working, then test locally!
