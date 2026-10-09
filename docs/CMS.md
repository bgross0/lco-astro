# Content management (Decap CMS)

Editors manage site content at **https://lakecountyoutdoor.com/admin/**. Decap
CMS commits changes to `bgross0/lco-astro` on GitHub; Cloudflare Pages rebuilds
the site from those commits.

## How it fits together

| Piece | Location |
| --- | --- |
| CMS app (loaded from jsDelivr, pinned with SRI) | `public/admin/index.html` |
| Collections and fields | `public/admin/config.yml` |
| GitHub OAuth for login | `functions/api/auth.js`, `functions/api/auth/callback.js` |
| Content the CMS edits | `src/content/**`, `src/data/settings.json` |
| Uploaded media | `public/images/uploads/` |

`publish_mode` is `editorial_workflow`: saving a draft opens a pull request on a
`cms/...` branch, Cloudflare Pages builds a preview for it, and **Publish**
merges it into `main`.

## What editors can change

| CMS collection | Files | Shows up on |
| --- | --- | --- |
| Homepage | `src/content/homepage/home.json` | `/` |
| Services | `src/content/services/*.md` | `/services/<file>/`, menus, footer, service cards |
| Service Area Pages | `src/content/service-areas/*.md` | `/service-areas/<city>-mn/` |
| Projects | `src/content/projects/*.md` | `/projects/` and `/projects/<file>/` |
| Reviews | `src/content/reviews/*.json` | review sections, `/reviews/` |
| Pages | `src/content/pages/*.md` | about-us, contact-us, gallery, shoreline-solutions, ... |
| Settings | `src/data/settings.json`, `src/data/navigation.json` | phones, address, hours, menus everywhere |

- **Phones, address and hours** live only in Settings; every page, the footer
  and the structured data read them from there. The first phone number is the
  one every "Call us" button dials.
- **Cities**: the list on the Service Areas page (Pages > Service Areas Page)
  is every city served. A city gets its own page only when it has an entry
  under Service Area Pages with copy written for it. When you publish one for
  a city that is in `public/_redirects` (most are, because the old site had
  no page for them), delete that city's two lines there in the same change;
  the build fails otherwise.
- **Reviews** must be real reviews, worded and attributed as on Google.
- **Images**: upload photos already resized (about 1600 px wide for page
  heroes, 1280 px for others, under ~400 KB) and always fill in the alt text.

## One-time setup

1. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth
   Apps → New):
   - Homepage URL: `https://lakecountyoutdoor.com`
   - Authorization callback URL: `https://lakecountyoutdoor.com/api/auth/callback`
2. In Cloudflare Pages → the project → Settings → Variables and Secrets, add
   for **Production**, as encrypted secrets:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
3. Give each editor a GitHub account with write access to `bgross0/lco-astro`.

Login only works on the production origin (`base_url` in `config.yml`). The
callback posts the token only to its own origin, so `/admin` on a `*.pages.dev`
preview or on `www.` cannot sign in; redirect `www` to the apex domain.

## Editing locally

```sh
npm run cms   # decap-server: local Git backend on 127.0.0.1:8081
npm run dev   # http://localhost:4321/admin/
```

With `local_backend: true`, Decap on localhost writes straight to your working
tree instead of GitHub.

decap-server has no authentication and, without `BIND_HOST`, listens on every
interface; the `cms` script pins it to loopback. Stop it when you are done.

## Changing the content model

Every key in a content file needs a matching field in `config.yml`; Decap
silently drops unknown keys when it saves an entry. When you add or rename a
field in `src/content.config.ts`, make the same change in `config.yml`.

- Number fields must set `value_type` (`int` or `float`); Decap otherwise
  parses with `parseInt`.
- If a field is required by the Zod schema, mark it `required: true` (the
  default) so an editor cannot save a value that breaks the build.

## Security notes

- The OAuth flow uses a `state` parameter bound to an HttpOnly
  `__Host-` cookie, so a forged callback is rejected.
- The token is posted only to this site's origin, after Decap's
  `authorizing:github` handshake, and the callback page runs under a
  nonce-based CSP.
- `auth_scope` is `public_repo` because the repository is public. If it becomes
  private, change `auth_scope` to `repo`; `functions/api/auth.js` already
  allows both.
- To update Decap, change the version in `public/admin/index.html` and
  recompute the SRI hash:

  ```sh
  curl -sL https://cdn.jsdelivr.net/npm/decap-cms@<version>/dist/decap-cms.js \
    | openssl dgst -sha384 -binary | openssl base64 -A
  ```
