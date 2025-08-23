# Decap CMS Setup Guide for Lake County Outdoors

## Overview
The site is fully integrated with Decap CMS (formerly Netlify CMS) for content management. Content editors can manage services, blog posts, and testimonials through a user-friendly interface.

## Accessing the CMS

1. Navigate to `https://lakecountyoutdoor.com/admin/`
2. Log in using Netlify Identity (first-time users need an invitation)
3. Once authenticated, you'll see the CMS dashboard

## Setup Requirements

### For Netlify Deployment
1. Enable Netlify Identity in the Netlify dashboard
2. Configure Git Gateway for authentication
3. Invite users through Netlify Identity settings

### For Local Development
- The CMS can be accessed at `http://localhost:4321/admin/` when running `npm run dev`
- Authentication will still go through Netlify Identity

## Content Collections

### Services
- Location: `src/content/services/`
- Fields:
  - Title: Service name
  - Description: Short description for cards
  - Image: Featured image path
  - Order: Display order (lower numbers appear first)
  - Body: Full service description (Markdown)

### Blog Posts
- Location: `src/content/blog/`
- Fields:
  - Title: Post title
  - Description: Meta description
  - Publish Date: Publication date
  - Author: Post author
  - Image: Featured image (optional)
  - Tags: Content tags (optional)
  - Draft: Toggle for draft posts
  - Body: Full post content (Markdown)

### Testimonials
- Location: `src/content/testimonials/`
- Fields:
  - Author: Customer name
  - Company: Customer's company (optional)
  - Service: Related service
  - Rating: 1-5 star rating
  - Body: Testimonial text (Markdown)

## Media Management

- Upload folder: `public/images/uploads/`
- All uploaded images are accessible at `/images/uploads/`
- Supported formats: JPG, PNG, GIF, WebP

## Adding New Content

1. Log into the CMS
2. Select the content type (Services, Blog, or Testimonials)
3. Click "New [Content Type]"
4. Fill in the required fields
5. Click "Save" to create a draft
6. Click "Publish" to make it live

## Editing Existing Content

1. Navigate to the content collection
2. Click on the item you want to edit
3. Make your changes
4. Save and publish

## Editorial Workflow

The CMS uses an editorial workflow:
- **Draft**: Content is saved but not published
- **In Review**: Content is ready for review
- **Ready**: Content is approved and ready to publish
- **Published**: Content is live on the site

## Troubleshooting

### Can't Access Admin Panel
- Ensure you have an active Netlify Identity account
- Check that JavaScript is enabled in your browser
- Clear browser cache and cookies

### Changes Not Appearing
- Ensure content is published (not in draft)
- Wait for build to complete (usually 2-3 minutes)
- Check build logs in Netlify dashboard

### Authentication Issues
- Verify Git Gateway is enabled in Netlify
- Check Netlify Identity settings
- Ensure user has proper permissions

## Technical Details

- CMS Config: `/public/admin/config.yml`
- Admin Interface: `/public/admin/index.html`
- Content Schema: `/src/content/config.ts`
- Build Command: `npm run build`
- Deploy Directory: `dist/`

## Support

For CMS issues or questions:
1. Check this documentation
2. Review Decap CMS documentation: https://decapcms.org/docs/
3. Contact your site administrator