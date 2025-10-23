# Decap CMS GitHub OAuth Setup

## What I Fixed

The main issue was a **typo in the repository name**:
- ❌ Was: `lakecountyoutdoor/lco-astro`
- ✅ Now: `lakecountyoutodoor/lco-astro` (note the "d" in "outodoor")

This was causing the 404 error you saw in the browser console.

---

## What You Need to Check/Do

### 1. Verify Cloudflare Environment Variables

The OAuth flow needs these two environment variables set in Cloudflare Pages:

1. Go to: [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Workers & Pages** → **lco-astro**
3. Go to: **Settings** → **Environment variables**
4. Verify these are set for **Production**:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

**If they're missing**, you need to create a GitHub OAuth App (see section 2 below).

---

### 2. Create/Verify GitHub OAuth App

You need a GitHub OAuth application for the CMS authentication.

#### Check if you already have one:
1. Go to: https://github.com/settings/developers
2. Look for an OAuth App for this site

#### If you don't have one, create it:
1. Go to: https://github.com/settings/applications/new
2. Fill in:
   - **Application name:** `Lake County Outdoors CMS`
   - **Homepage URL:** `https://lakecountyoutdoor.com`
   - **Authorization callback URL:** `https://lakecountyoutdoor.com/api/auth/callback`
3. Click **"Register application"**
4. You'll see:
   - **Client ID** (visible immediately)
   - Click **"Generate a new client secret"** to get the secret

#### Add credentials to Cloudflare:
1. Copy the **Client ID** and **Client Secret**
2. Go to Cloudflare Pages → lco-astro → Settings → Environment variables
3. Add both for **Production** environment:
   - Variable: `GITHUB_CLIENT_ID` → Value: [your client ID]
   - Variable: `GITHUB_CLIENT_SECRET` → Value: [your client secret]

---

### 3. Deploy and Test

Once the environment variables are set:

```bash
# Commit the fixed config
git add -A
git commit -m "Fix: Correct repo name typo in CMS config (lakecountyoutodoor)"
git push
```

Wait for Cloudflare to deploy (~2 minutes), then test:

1. Go to: `https://lakecountyoutdoor.com/admin/`
2. Click **"Login with GitHub"**
3. A popup should open with GitHub's authorization page
4. Click **"Authorize"** (if prompted)
5. Popup closes, you should be logged into the CMS!

---

## Troubleshooting

### Error: "OAuth not configured"
**Problem:** `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET` not set in Cloudflare
**Solution:** Follow section 2 above to create OAuth app and add env vars

### Error: 404 when accessing repository
**Problem:** Repo name is wrong or you don't have access
**Solution:** Check that the repo name is `lakecountyoutodoor/lco-astro` (with the "d")

### Popup opens and closes immediately
**Problem:** Callback URL mismatch
**Solution:** In GitHub OAuth App settings, make sure callback URL is:
```
https://lakecountyoutdoor.com/api/auth/callback
```

### "Authorization failed" or similar error
**Problem:** OAuth app not authorized for the repository
**Solution:**
1. Check that your GitHub account has access to `lakecountyoutodoor/lco-astro`
2. If it's an organization repo, make sure the OAuth app is approved by the org
3. Go to: https://github.com/organizations/lakecountyoutodoor/settings/oauth_application_policy

---

## How It Works

```
User clicks "Login with GitHub"
          ↓
Popup opens → /api/auth
          ↓
Redirects to GitHub OAuth
          ↓
User authorizes
          ↓
GitHub redirects → /api/auth/callback
          ↓
Callback exchanges code for access token
          ↓
Returns token to CMS via postMessage
          ↓
CMS stores token, user is authenticated!
```

---

## Files Changed

- `public/admin/config.yml` - Fixed repo name typo
- `functions/api/auth.js` - Restored OAuth handler
- `functions/api/auth/callback.js` - Restored OAuth callback

---

## If This Still Doesn't Work

If you're still having issues after:
1. ✅ Fixing the repo name typo
2. ✅ Setting up GitHub OAuth App
3. ✅ Adding env vars to Cloudflare
4. ✅ Deploying

Then we can look into alternatives like:
- Git Gateway with Netlify Identity
- External OAuth service
- Or I can help debug further

But honestly, it should work now - the main issue was just the repo name typo!
