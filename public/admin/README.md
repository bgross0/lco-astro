# Decap CMS Setup for Lake County Outdoors

This directory contains the Decap CMS configuration for managing content on the Lake County Outdoors website.

## Setup Instructions

### 1. GitHub OAuth Configuration

To enable authentication, you need to set up GitHub OAuth:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Application name: `Lake County Outdoors CMS`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-domain.com/api/auth/callback`
3. Note the Client ID and Client Secret

### 2. Cloudflare Pages Configuration

Add these environment variables to your Cloudflare Pages project:

- `GITHUB_CLIENT_ID`: Your OAuth app's Client ID
- `GITHUB_CLIENT_SECRET`: Your OAuth app's Client Secret

### 3. OAuth Proxy Setup

For Cloudflare Pages, you'll need to set up an OAuth proxy. Options include:

1. **Using Netlify's OAuth proxy** (free):
   - Update `config.yml` to use:
     ```yaml
     backend:
       name: github
       repo: your-username/your-repo
       branch: main
       base_url: https://api.netlify.com
       auth_endpoint: auth
     ```

2. **Self-hosted OAuth proxy**:
   - Deploy an OAuth proxy function to Cloudflare Workers
   - Update the `base_url` and `auth_endpoint` accordingly

### 4. Update Configuration

In `/public/admin/config.yml`, update:

- `backend.repo`: Your GitHub repository (format: `username/repo`)
- `backend.base_url`: Your Cloudflare Pages URL or OAuth proxy URL
- `site_url`: Your production website URL
- `display_url`: Your production website URL

## Accessing the CMS

Once configured, access the CMS at: `https://your-domain.com/admin/`

## Content Structure

- **Services**: Managed in `/src/content/services/`
- **Testimonials**: Managed in `/src/content/testimonials/`
- **Blog Posts**: Managed in `/src/content/blog/`
- **Settings**: Managed in `/src/data/settings.json`
- **Uploaded Images**: Stored in `/public/images/uploads/`

## Troubleshooting

### Authentication Issues
- Verify GitHub OAuth app settings
- Check environment variables in Cloudflare Pages
- Ensure the OAuth proxy is properly configured

### Content Not Appearing
- Check that content files have proper frontmatter
- Rebuild the site after adding new content
- Verify the Astro collections are properly configured in `/src/content/config.ts`

### Preview Issues
- Ensure the `site_url` in config.yml matches your deployed site
- Check that all required fields are filled in the CMS editor