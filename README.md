# Lake County Outdoors website

Marketing site for Lake County Outdoors, LLC (Edina, MN), served at
https://lakecountyoutdoor.com.

- **Astro 7**, static output, no client framework
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
  content/            Markdown and JSON edited through the CMS
  content.config.ts   Collection schemas (keep in sync with public/admin/config.yml)
  data/settings.json  Business details: phones, address, hours, social links
  components/         Astro components, styled with scoped CSS
  layouts/            BaseLayout: meta tags, LocalBusiness JSON-LD
  lib/phone.ts        Display text and tel: links derived from settings.json
  pages/              Routes
  styles/             Global reset, typography, and design tokens
public/
  _headers            Response headers for static assets
  _redirects          Legacy URL redirects
  admin/              Decap CMS app and collection config
  images/             Site images; CMS uploads go to images/uploads/
functions/api/        Request handlers: contact form, GitHub OAuth for Decap
worker/index.js       Worker entry; routes /api/* to the handlers
wrangler.jsonc        Worker config (production + staging)
```

Styling is plain CSS. Design tokens (colors, spacing, type scale) live in
`src/styles/variables.css`; components use BEM class names in scoped
`<style>` blocks.

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
- Astro does not optimize images referenced by path from `public/`. Resize
  photos before adding them; anything over ~400 KB is almost certainly too big.

## Contact form

The quote form on `/contact` posts to `functions/api/contact.js`, which:

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

The visitor lands on `/thank-you/` only after Odoo confirms the submission was
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
