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
functions/api/        GitHub OAuth for Decap (Cloudflare Pages Functions)
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
| Secrets | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (CMS login) |

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

`/contact` posts to FormSubmit, which emails submissions and forwards them to
the CRM webhook. Everything in the form, including the webhook URL, is public
HTML.
