# Decap CMS Documentation

## Overview

This project uses Decap CMS (formerly Netlify CMS) to manage content. The CMS is accessible at `/admin/` and allows non-technical users to edit website content through a user-friendly interface.

**CMS URL:** https://lakecountyoutdoor.com/admin/

---

## Authentication

### How Login Works

1. Navigate to `/admin/`
2. Click "Login with GitHub"
3. Authorize the application (if first time)
4. You're logged in!

### Who Can Access?

- Anyone with commit access to the `lakecountyoutodoor/lco-astro` GitHub repository
- To add new users: Give them repository access in GitHub settings

### Technical Details

- **Backend:** GitHub (uses GitHub's OAuth for authentication)
- **OAuth Handler:** Cloudflare Functions at `/functions/api/auth/`
- **Environment Variables Required:**
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

---

## Content Structure

### Collections

The CMS manages the following content types:

#### 1. **Services** (`src/content/services/`)
- Individual service pages (e.g., snow removal, landscaping)
- Fields: title, description, image, order, SEO settings
- File format: Markdown with frontmatter

#### 2. **Testimonials** (`src/content/testimonials/`)
- Customer reviews and testimonials
- Fields: author, company, service, rating (1-5), testimonial text
- File format: Markdown with frontmatter

#### 3. **Blog Posts** (`src/content/blog/`)
- News articles and blog content
- Fields: title, description, publish date, author, featured image, tags, draft status, SEO
- File format: Markdown with frontmatter

#### 4. **Homepage Sections** (`src/content/homepage/`)
Editable JSON files for homepage content:
- **Hero Section** (`hero.json`) - Main hero carousel with images and CTAs
- **Services Showcase** (`services-showcase.json`) - Interactive services slider
- **About & Other Sections** (`content.json`) - About, equipment, CTA, reviews sections

#### 5. **Pages** (`src/content/pages/`)
- **Service Areas** - Geographic coverage and cities served
- **Contact** - Contact form settings and information

#### 6. **Settings** (`src/data/settings.json`)
Global site settings:
- Site title and description
- Contact information (phone, email, address)
- Business hours
- Social media links
- Analytics configuration
- A/B testing settings

---

## Media Management

### Image Uploads

**Upload Location:** `/public/images/uploads/`
- All new CMS uploads go to this dedicated folder
- Keeps media organized and easy to manage
- Existing images remain in their current locations

**Best Practices:**
- Keep images under 5MB
- Use JPG format for photos (best compatibility)
- Use WebP for smaller file sizes (modern browsers)
- Always add descriptive alt text for accessibility

### Existing Images

Images are organized in subdirectories:
- `/public/images/services/` - Service-specific images
- `/public/images/landscaping/` - Landscaping images
- `/public/images/snow-removal/` - Snow removal images
- `/public/images/equipment/` - Equipment photos
- `/public/images/gallery/` - General gallery images

You can browse and select existing images in the media library when editing content.

---

## Publishing Workflow

### Simple Mode (Current Setup)

**How it works:**
1. Edit content in the CMS
2. Click "Publish"
3. Changes are committed directly to the `main` branch
4. Cloudflare Pages automatically rebuilds the site (~2 minutes)
5. Your changes are live!

**Advantages:**
- Fast and simple
- No approval process needed
- Perfect for small teams

**When to be careful:**
- Major content rewrites
- Homepage hero changes
- Anything affecting SEO significantly

For critical changes, consider testing locally first or creating a manual pull request through GitHub.

---

## Common Tasks

### Adding a New Blog Post

1. Go to `/admin/` → Collections → Blog Posts
2. Click "New Blog Post"
3. Fill in:
   - Title (required)
   - Description (required) - appears in search results
   - Publish Date (required) - use date picker
   - Author (defaults to "Lake County Outdoors")
   - Featured Image (optional) - upload or select existing
   - Tags (optional) - helps with organization
   - Body content (required) - use Markdown editor
4. Click "Publish"
5. Wait 2 minutes for site rebuild

### Adding a Testimonial

1. Go to `/admin/` → Collections → Testimonials
2. Click "New Testimonial"
3. Fill in:
   - Author (required) - customer name
   - Company (optional)
   - Service (required) - which service they used
   - Rating (required) - 1-5 stars
   - Testimonial (required) - their review
4. Click "Publish"

### Updating Homepage Hero

1. Go to `/admin/` → Homepage → Hero Section
2. Edit:
   - Title and description
   - CTA button text and links
   - Carousel images (upload new or select existing)
3. Click "Publish"

### Changing Contact Information

1. Go to `/admin/` → Settings → General Settings
2. Update phone, email, address, business hours, etc.
3. Click "Publish"
4. Changes appear site-wide (header, footer, contact page)

---

## Configuration Files

### CMS Config (`/public/admin/config.yml`)

Main configuration file for Decap CMS. Defines:
- Backend (GitHub)
- Collections and fields
- Media settings
- Publish mode

**Don't edit this file unless you know what you're doing!**

### Astro Content Schema (`/src/content/config.ts`)

Defines TypeScript schemas for content validation.
- Must match CMS field definitions
- Ensures type safety in components
- Validates content structure

---

## Content Schema Reference

### Services Schema

```yaml
title: string (required)
description: string (required)
image: string path (required)
order: number (optional, default: 0)
seo:
  metaTitle: string (≤60 chars)
  metaDescription: string (≤160 chars)
  focusKeyword: string
  canonicalUrl: string
  schemaType: "Service" | "Product" | "LocalBusiness" | "Article"
body: markdown (optional)
```

### Blog Post Schema

```yaml
title: string (required)
description: string (required)
pubDate: date in YYYY-MM-DD format (required)
author: string (required, default: "Lake County Outdoors")
image: string path (optional)
imageAlt: string (optional)
tags: list of strings (optional)
draft: boolean (default: false)
seo:
  metaTitle: string (≤60 chars)
  metaDescription: string (≤160 chars)
  focusKeyword: string
body: markdown (required)
```

### Testimonial Schema

```yaml
author: string (required)
company: string (optional)
service: string (required)
rating: number 1-5 (required)
body: markdown (required)
```

---

## Troubleshooting

### Can't Log In

**Problem:** "Login with GitHub" button doesn't work
**Solutions:**
1. Check that you have access to the `lakecountyoutodoor/lco-astro` repository on GitHub
2. Clear browser cache and try again
3. Verify OAuth environment variables are set in Cloudflare Pages
4. Check browser console for errors (F12 → Console tab)

### Changes Not Appearing

**Problem:** Published changes aren't live on the site
**Solutions:**
1. Wait 2-3 minutes for Cloudflare Pages rebuild
2. Hard refresh the page (Ctrl/Cmd + Shift + R)
3. Check Cloudflare Pages dashboard for deployment status
4. Verify changes were committed to GitHub (check recent commits)

### Image Upload Fails

**Problem:** Can't upload images or upload is slow
**Solutions:**
1. Check image file size (must be under 5MB)
2. Use JPG or WebP format (avoid HEIC, RAW)
3. Check internet connection
4. Try uploading a smaller image first
5. Use image compression tool before uploading

### Content Validation Error

**Problem:** "Field X is required" or similar error when publishing
**Solutions:**
1. Make sure all required fields are filled in
2. Check that field formats are correct (e.g., dates, URLs)
3. For SEO fields, ensure character limits are respected
4. For images, use valid paths starting with `/images/`

---

## Best Practices

### Content Writing

1. **Use clear, descriptive titles** - helps with SEO and user understanding
2. **Write meta descriptions** - these appear in Google search results
3. **Add alt text to all images** - required for accessibility and SEO
4. **Use heading hierarchy** - H2 → H3 → H4 (not H2 → H4)
5. **Keep paragraphs short** - 2-3 sentences for web readability

### SEO Tips

1. **Focus keyword** - pick one main keyword per page/post
2. **Meta title** - keep under 60 characters, include focus keyword
3. **Meta description** - keep under 160 characters, compelling call-to-action
4. **Image names** - use descriptive names like `snow-removal-truck.jpg` not `IMG_1234.jpg`
5. **Internal links** - link to related services/posts when relevant

### Image Guidelines

1. **Aspect ratios:**
   - Hero images: 16:9 or wider (1920x1080 recommended)
   - Service images: 16:9 (1200x675 recommended)
   - Blog images: 16:9 (1200x675 recommended)
   - Square images: 1:1 (600x600 recommended)

2. **File size:** Compress before uploading
   - Target: 200-500KB for large images
   - Target: 50-150KB for thumbnails
   - Use tools like TinyPNG or Squoosh

3. **Format:**
   - JPG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers (smaller file size)

---

## For Developers

### Local CMS Testing

To test CMS changes locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access CMS at http://localhost:4321/admin/
```

**Note:** GitHub OAuth won't work on localhost. Use one of these options:
1. Use a test mode backend in `config.yml`
2. Edit content files directly in `/src/content/`
3. Use `npx netlify-cms-proxy-server` for local backend proxy

### Adding New Collections

1. Update `/public/admin/config.yml`:
   ```yaml
   collections:
     - name: "my-collection"
       label: "My Collection"
       folder: "src/content/my-collection"
       create: true
       fields:
         - { label: "Title", name: "title", widget: "string" }
   ```

2. Create Astro content schema in `/src/content/config.ts`:
   ```typescript
   const myCollection = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
     }),
   });
   ```

3. Create the content folder: `mkdir -p src/content/my-collection`

4. Commit and deploy

### Updating CMS Configuration

When editing `/public/admin/config.yml`:
1. Test changes locally first
2. Validate YAML syntax (indentation matters!)
3. Check Astro schema matches CMS fields
4. Document new fields in this file
5. Commit with descriptive message

---

## Recent Improvements (2025)

### What Was Fixed

1. ✅ **Updated to Decap CMS 3.4+** - Latest features and bug fixes
2. ✅ **Simplified authentication** - Removed 70+ lines of custom OAuth code
3. ✅ **Cleaned up media organization** - New uploads go to `/images/uploads/`
4. ✅ **Switched to simple publish mode** - No more PR approval overhead
5. ✅ **Fixed blog date fields** - Now uses date picker (not datetime)
6. ✅ **Removed duplicate content** - Hero section no longer duplicated
7. ✅ **Deleted unused files** - Removed `/public/admin/astro-decap-cms/` boilerplate

### Result

- **Cleaner codebase** - Less complexity, easier maintenance
- **Faster publishing** - No approval process for content updates
- **Better organization** - Consistent media folder structure
- **Improved UX** - More intuitive date/time pickers
- **Less confusion** - Single source of truth for each content type

---

## Support

### Getting Help

1. **Check this documentation first** - most questions are answered here
2. **Review the Decap CMS docs** - https://decapcms.org/docs/
3. **Check GitHub issues** - common problems may have known solutions
4. **Ask the development team** - they know the codebase

### Useful Links

- **Decap CMS Docs:** https://decapcms.org/docs/
- **Markdown Guide:** https://www.markdownguide.org/basic-syntax/
- **GitHub Repository:** https://github.com/lakecountyoutodoor/lco-astro
- **Cloudflare Pages Dashboard:** https://dash.cloudflare.com/
- **Production Site:** https://lakecountyoutdoor.com

---

## Changelog

**2025-01-XX** - Major CMS cleanup and improvements
- Updated to Decap CMS 3.4
- Removed custom OAuth code
- Switched to simple publish mode
- Standardized media folder structure
- Fixed blog date field configuration
- Removed duplicate hero content
- Cleaned up unused boilerplate files

**2025-10-05** - Initial CMS setup
- Configured GitHub OAuth
- Set up collections for services, blog, testimonials
- Created homepage content management
- Added settings management
