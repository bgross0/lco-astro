# Lake County Outdoors website

Marketing site for Lake County Outdoors, LLC (Edina, MN), served at
https://lakecountyoutdoor.com.

- **Astro 7**, static output; pages are assembled from **shadcn/studio** blocks
  (React, rendered to HTML at build time) styled with **Tailwind CSS v4**
- **Decap CMS** at `/admin` for content editing (see [docs/CMS.md](docs/CMS.md))
- **Cloudflare Workers** (static assets) for hosting; `/api/*` handles the quote form and CMS login

## Development

Requires Node 22.12 or newer (`.nvmrc` pins 24).

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run cms       # local Decap backend, see docs/CMS.md
```

`npm run dev` serves pages only; `npm run preview` builds and runs the full
Worker (pages plus `/api/*`) with secrets from an untracked `.dev.vars` file.

## Layout

```text
src/
  content/            Markdown and JSON edited through the CMS (see docs/CMS.md)
    services/         One file per /services/<slug> page
    service-areas/    One file per /service-areas/<city>-mn page
    projects/         One file per /projects/<slug> page
    reviews/          Google reviews shown on the site, one JSON file each
    pages/            Copy for about-us, contact-us, gallery, shoreline-solutions, ...
    homepage/         Homepage sections
    blog/             Blog posts
  content.config.ts   Collection schemas (keep in sync with public/admin/config.yml)
  data/settings.json  Business details: phones, address, hours, social links
  data/navigation.json  Main menu and footer company links
  components/
    shadcn-studio/    The shadcn/studio blocks the pages are built from, adapted to take real content
    ui/               shadcn/ui components the blocks use
    site/             ServiceAreaMap (MapLibre), the one section with no block
  layouts/            Layout.astro: meta tags, LocalBusiness JSON-LD, navbar and footer
  lib/                Helpers: phones, address/hours, collection queries, images, block data
  pages/              Routes
  styles/shadcn.css   Tailwind and the theme (brand colors and fonts as shadcn CSS variables)
public/
  _headers            Response headers for static assets
  _redirects          301s for retired URLs (checked at build time)
  admin/              Decap CMS app and collection config
  images/             Site images; CMS uploads go to images/uploads/
functions/api/        Request handlers: contact form, GitHub OAuth for Decap
worker/index.js       Worker entry; routes /api/* to the handlers
wrangler.jsonc        Worker config (production + staging)
```

## Design system

Every section is a shadcn/studio PRO block (`src/components/shadcn-studio/blocks`,
installed with `npx shadcn add @ss-blocks/<name>`; the registry license is
read from an untracked `.env` with `EMAIL` and `LICENSE_KEY`). The blocks keep
their structure and take the site's content as props. Styling is Tailwind
utilities only; the brand lives in the CSS variables in `src/styles/shadcn.css`
(`--primary` is the LCO blue darkened to `#2a64a6` so white text on it passes
WCAG AA; headings use Montserrat, body text Geist, both self-hosted).

Blocks render to static HTML. Only these hydrate as React islands:

| Island | Directive | Why |
| --- | --- | --- |
| Navbar 02 | `client:load` | services mega menu and the mobile menu |
| Features 15 | `client:visible` | service category tabs |
| About us 03 (with tabs) | `client:visible` | tabs |

Everything else needs no JavaScript or a few lines of page script: the
FAQ is native `<details>`, the testimonial and hero marquees are CSS (with a
pause button), and the contact form posts with a small fetch script. The
blocks' `motion` entrance animations are replaced by a static
`MotionPreset`, so content is never hidden waiting for JavaScript.

The service-area map (`src/components/site/ServiceAreaMap.astro`) uses
MapLibre GL JS from npm with OpenFreeMap tiles
(`https://tiles.openfreemap.org/styles/liberty`). The library, its worker and
its CSS load only when the map nears the viewport. City coordinates are part
of the content (Pages > Service Areas Page); they were geocoded once with
OpenStreetMap Nominatim and are not looked up at build time.

## Deployment (Cloudflare Workers)

The site deploys as a Worker with static assets (`wrangler.jsonc`). Static
pages are served directly from the assets binding, with `public/_headers` and
`public/_redirects` applied; only `/api/*` runs `worker/index.js`, which routes
to the handlers in `functions/api/`.

| Command | Target |
| --- | --- |
| `npm run deploy:staging` | `lco-astro-staging` on `*.workers.dev` (preview) |
| `npm run deploy:production` | `lco-astro` (production; custom domain at go-live) |
| `npm run preview` | build, then run the Worker locally with `wrangler dev` |

After go-live, production deploys from Git: Workers Builds builds and deploys
every push to `main`, which is also where Decap publishes content. Without
that connection, CMS edits never reach the site. Setup and the DNS cutover are
in [docs/GO-LIVE.md](docs/GO-LIVE.md).

Secrets are per Worker (`npx wrangler secret put <NAME> --env staging`):
`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (CMS login), `FREEFORM_WEBHOOK_URL`,
`FREEFORM_WEBHOOK_SECRET`, `TURNSTILE_SECRET_KEY` (contact form).
`PUBLIC_TURNSTILE_SITE_KEY` is a build-time variable (set it in the shell or
CI when running `npm run build`).

Notes:

- Every `*.workers.dev` host (staging and per-version preview URLs) is served
  with `X-Robots-Tag: noindex` via `public/_headers`, so previews are never
  indexed; the production domain is unaffected.
- CMS login works only on the production origin (`base_url` in
  `public/admin/config.yml`).
- Pointing the apex domain `lakecountyoutdoor.com` at the Worker requires its
  DNS zone to be on Cloudflare (nameservers are currently at GoDaddy).
- `public/_headers` rules are additive and Cloudflare joins duplicate headers
  with a comma. Never set the same header in overlapping rules.
- Only `/_assets/*` (fingerprinted build output) is cached as immutable. Files
  under `public/` keep their URL when replaced, so they get a short cache.
- Images under `public/images` (CMS uploads included) are optimized at build
  time by `scripts/webp-images.mjs`: WebP copies at 480-2560px widths and a
  `srcset` on every `<img>`, so each screen gets the smallest sharp file.
  Upload the best original you have (up to ~2560px wide); never upload a
  pre-shrunk copy. Encodes are cached in `node_modules/.cache/webp-images`.
  AVIF is left to Cloudflare (Polish or image transformations) once the
  domain is on Cloudflare, because encoding it at build time is ~13x slower.
  Smaller copies saved next to an image as `name-768w.jpg`, `name-1280w.jpg`
  are picked up automatically for `srcset` (`src/lib/images.ts`).
- URLs have no trailing slash, as on the previous live site (`/reviews`,
  `/services/sod-installation`). Astro builds `reviews.html`
  (`build.format: 'file'`, `trailingSlash: 'never'`); the Worker serves it at
  `/reviews` and answers `/reviews/` with a 307 to `/reviews`. Link to the
  slashless form only; `npm run check:dist` flags slashed page links.
- The build fails if `public/_redirects` points at a missing page or would
  hide a page that exists. After `npm run build`, `npm run check:dist`
  checks every local link and asset and every URL the previous live site
  served (`scripts/live-urls.txt`).

## Contact form

The quote form on `/contact-us` posts to `functions/api/contact.js`, which:

1. rejects bots via a hidden honeypot field and Cloudflare Turnstile,
2. validates the fields, and
3. delivers the submission to the Cobuild tenant's `atlas_freeform` webhook
   (`FREEFORM_WEBHOOK_URL`, i.e. `https://lco.axsys.app/freeform/webhook`),
   signed with `FREEFORM_WEBHOOK_SECRET` (`X-Freeform-Signature:
   t=<unix>,v1=<hex HMAC-SHA256 of "t.body">`), with the submission id as
   `X-Freeform-Delivery` for idempotency.

`atlas_freeform` stores it as a `freeform.submission` and creates a CRM lead
(or stages it for approval, per the form's settings in Odoo). The form record
is created on first delivery under the fixed `FORM_ID` in the function; keys
are chosen to auto-map onto the lead (`name`, `email`, `phone`, `company`,
`message`; `subject` becomes the lead title).

The visitor lands on `/thank-you` only after Odoo confirms the submission was
stored. If Odoo is unreachable or rejects it, the form shows an error with the
office number and keeps what was typed; the failure is in the Worker
logs (`npx wrangler tail`). There is no queue in front of Odoo, so a failed delivery is not retried.

`FREEFORM_WEBHOOK_SECRET` must equal the tenant's `freeform.webhook_secret`
system parameter in Odoo. To rotate it, change both.

Turnstile needs both `PUBLIC_TURNSTILE_SITE_KEY` (build variable) and
`TURNSTILE_SECRET_KEY` (secret). If neither is set, the form still works,
protected by the honeypot only. Setting the secret without the site key
rejects every submission.

To test locally, put `FREEFORM_WEBHOOK_URL` and `FREEFORM_WEBHOOK_SECRET` in an
untracked `.dev.vars`, then `npm run preview`.
Turnstile's documented test keys (`1x00000000000000000000AA` /
`1x0000000000000000000000000000000AA`) always pass.
