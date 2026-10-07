# Lake County Outdoors website

Marketing site for Lake County Outdoors, LLC (Edina, MN), served at
https://lakecountyoutdoor.com.

- **Astro 7**, static output, no client framework
- **Decap CMS** at `/admin` for content editing (see [docs/CMS.md](docs/CMS.md))
- **Cloudflare Pages** for hosting, plus two Pages Functions for CMS login

## Development

Requires Node 22.12 or newer (`.nvmrc` pins 24).

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run cms       # local Decap backend, see docs/CMS.md
```

`npm run dev` and `preview` do not run the Pages Functions. To test CMS login
locally, build and run `npx wrangler pages dev dist` with `GITHUB_CLIENT_ID`
and `GITHUB_CLIENT_SECRET` in an untracked `.dev.vars` file.

## Layout

```text
src/
  content/            Markdown and JSON edited through the CMS
  content.config.ts   Collection schemas (keep in sync with public/admin/config.yml)
  data/settings.json  Business details: phones, address, hours, social links
  components/         Astro components, styled with scoped CSS
  layouts/            BaseLayout: meta tags, LocalBusiness JSON-LD
  lib/phone.ts        Display text and tel: links derived from settings.json
  pages/              Routes
  styles/             Global reset, typography, and design tokens
public/
  _headers            Cloudflare Pages response headers
  _redirects          Legacy URL redirects
  admin/              Decap CMS app and collection config
  images/             Site images; CMS uploads go to images/uploads/
functions/api/        Pages Functions: contact form handler, GitHub OAuth for Decap
```

Styling is plain CSS. Design tokens (colors, spacing, type scale) live in
`src/styles/variables.css`; components use BEM class names in scoped
`<style>` blocks.

## Deployment (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | from `.nvmrc` |
| Secrets | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (CMS login); `CRM_WEBHOOK_URL`, `TURNSTILE_SECRET_KEY` (contact form) |
| Build variable | `PUBLIC_TURNSTILE_SITE_KEY` (contact form) |

Pushes to `main` deploy production; other branches and CMS pull requests get
preview deployments.

Notes:

- Pointing the apex domain `lakecountyoutdoor.com` at Pages requires its DNS
  zone to be on Cloudflare (nameservers are currently at GoDaddy). Add `www` as
  a second custom domain and redirect it to the apex; CMS login only works on
  the apex origin.
- `public/_headers` rules are additive and Cloudflare joins duplicate headers
  with a comma. Never set the same header in overlapping rules.
- Only `/_assets/*` (fingerprinted build output) is cached as immutable. Files
  under `public/` keep their URL when replaced, so they get a short cache.
- Astro does not optimize images referenced by path from `public/`. Resize
  photos before adding them; anything over ~400 KB is almost certainly too big.

## Contact form

The quote form on `/contact` posts to `functions/api/contact.js`, which:

1. rejects bots via a hidden honeypot field and Cloudflare Turnstile,
2. validates the fields, and
3. forwards the lead as JSON to the CRM webhook (`CRM_WEBHOOK_URL`, the full
   `https://lco.axsys.app/submitform/webhook/v2/<token>` URL), where the
   `atlas_submitform` module turns it into a CRM lead.

The visitor lands on `/thank-you/` only after the CRM confirms the lead. If the
CRM is unreachable or rejects it, the form shows an error with the office
number and keeps what was typed; the failure is in the Pages Function logs.

The webhook token must never appear in page HTML. To rotate it, change the
`submitform.webhook_secret` system parameter in Odoo and update
`CRM_WEBHOOK_URL` in Cloudflare.

Turnstile needs both `PUBLIC_TURNSTILE_SITE_KEY` (build variable) and
`TURNSTILE_SECRET_KEY` (secret). If neither is set, the form still works,
protected by the honeypot only. Setting the secret without the site key
rejects every submission.

To test locally, put `CRM_WEBHOOK_URL` in an untracked `.dev.vars`, then
`npm run build && npx wrangler pages dev dist`. Turnstile's documented test
keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`)
always pass.
