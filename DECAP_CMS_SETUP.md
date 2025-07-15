# Decap CMS Setup Guide for Lake County Outdoors

This guide will help you set up Decap CMS with GitHub authentication for your Cloudflare Pages site.

## Prerequisites

- GitHub account
- Cloudflare account
- This repository deployed to Cloudflare Pages

## Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: Lake County Outdoors CMS
   - **Homepage URL**: https://your-site.pages.dev (your Cloudflare Pages URL)
   - **Authorization callback URL**: https://decap-oauth.workers.dev/api/callback (your Worker URL)
4. Click "Register application"
5. Save the **Client ID** and generate a **Client Secret** - you'll need these

## Step 2: Deploy OAuth Worker to Cloudflare

### Option A: Using Wrangler CLI

1. Install Wrangler if you haven't:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create the Worker:
   ```bash
   wrangler deploy decap-oauth-worker.js
   ```

4. Set environment variables:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   # Enter your GitHub Client ID when prompted
   
   wrangler secret put GITHUB_CLIENT_SECRET
   # Enter your GitHub Client Secret when prompted
   
   wrangler secret put SITE_URL
   # Enter your Cloudflare Pages URL (e.g., https://lco-astro.pages.dev)
   ```

### Option B: Using Cloudflare Dashboard

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click "Create application" → "Create Worker"
3. Name it `decap-oauth`
4. Click "Deploy"
5. Click "Edit code"
6. Copy the contents of `decap-oauth-worker.js` and paste it
7. Click "Save and deploy"
8. Go to Settings → Variables
9. Add the following environment variables:
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret (encrypt this)
   - `SITE_URL`: Your Cloudflare Pages URL

## Step 3: Update CMS Configuration

1. Edit `/public/admin/config.yml`
2. Update the backend configuration:
   ```yaml
   backend:
     name: github
     repo: bgross0/lco-astro  # Change to your GitHub username/repo
     branch: main
     base_url: https://decap-oauth.workers.dev  # Your Worker URL
     auth_endpoint: api/auth
   ```

## Step 4: Deploy to Cloudflare Pages

1. Push your changes to GitHub
2. Cloudflare Pages will automatically build and deploy

## Step 5: Access the CMS

1. Navigate to `https://your-site.pages.dev/admin`
2. Click "Login with GitHub"
3. Authorize the application
4. You should now have access to the CMS!

## Troubleshooting

### "Error: Failed to load config.yml"
- Make sure `/public/admin/config.yml` exists and is properly formatted

### "Authentication failed"
- Verify your GitHub OAuth App settings
- Check that the Worker environment variables are set correctly
- Ensure the callback URL in GitHub matches your Worker URL

### "CORS errors"
- Check that `SITE_URL` environment variable in the Worker matches your site URL
- Verify the Worker is deployed and accessible

## Managing Content

Once logged in, you can:
- Edit the hero section content
- Add/edit services
- Manage testimonials
- Update company information
- Control page sections

All changes will create pull requests in your GitHub repository for review before going live.

## Security Notes

- Never commit your GitHub Client Secret to the repository
- Use Cloudflare's encrypted environment variables for sensitive data
- Regularly rotate your OAuth credentials
- Consider adding branch protection rules in GitHub

## Support

For issues with:
- Decap CMS: https://github.com/decaporg/decap-cms
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- This setup: Create an issue in your repository