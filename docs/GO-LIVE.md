# Go-live: Cloudflare Workers + DNS cutover

Moves https://lakecountyoutdoor.com from Vercel to the `lco-astro` Cloudflare
Worker, and the DNS zone from GoDaddy to Cloudflare. GoDaddy stays the
registrar. Email (Microsoft 365 via GoDaddy, filtered by Proofpoint) depends on
the same zone, so the DNS steps are the risky part. Do them in order: the site
keeps serving from Vercel until step 5, and email is checked on its own in
step 4 before the website changes.

> **Content parity.** This repo carries every page of the live Next.js site
> (crawled 2026-10-08): 19 services, 9 city pages, shoreline, gallery,
> projects, reviews, about, contact and sitemap. The live URLs that had no page
> (trenching and 20 city URLs, which the Next.js site sent to its homepage)
> 301 to the closest page. `npm run build && npm run check:dist` verifies every
> live URL in `scripts/live-urls.txt`.

DNS inventory taken 2026-10-08 from public lookups (`dig`), re-checked
2026-10-09. Public lookups cannot list every record, so step 3 starts with
GoDaddy's zone export.

## 0. Prerequisites

- [ ] **Client sign-off** on staging:
      https://lco-astro-staging.ben-8b4.workers.dev
- [ ] **Set the freeform webhook secret on the CRM.** lco.axsys.app is the
      Cobuild tenant (not the old lco-crm). Settings > Technical > System
      Parameters > `freeform.webhook_secret`: a long random value. The same
      value goes into `FREEFORM_WEBHOOK_SECRET` below. `atlas_freeform` must be
      installed on the tenant.
- [ ] **GitHub OAuth App for Decap** (see `docs/CMS.md`). Callback:
      `https://lakecountyoutdoor.com/api/auth/callback`.
- [ ] **Turnstile widget** (optional; Cloudflare dashboard > Turnstile),
      hostnames `lakecountyoutdoor.com`, `www.lakecountyoutdoor.com` and
      `lco-astro-staging.ben-8b4.workers.dev`. This gives a site key and a
      secret key. Without it the form relies on the honeypot.
- [ ] **Merge the site into `main`.** Decap commits content to `main`
      (`public/admin/config.yml`), so `main` is the production branch.

## 1. Production Worker, secrets and Git builds

Production must build from Git. Decap publishes by committing to `main`; with
manual deploys only, CMS edits would never reach the site.

1. Create the Worker: `npm run deploy:production`. It serves at
   `https://lco-astro.ben-8b4.workers.dev` (noindex, like staging). There is
   no custom domain yet.
2. Runtime secrets on the production Worker (`npx wrangler secret put <NAME>`,
   no `--env`), or in the dashboard under the Worker's Settings > Variables
   and Secrets:

   | Name | Value |
   | --- | --- |
   | `FREEFORM_WEBHOOK_URL` | `https://lco.axsys.app/freeform/webhook` |
   | `FREEFORM_WEBHOOK_SECRET` | same value as `freeform.webhook_secret` in Odoo |
   | `GITHUB_CLIENT_ID` | OAuth App client ID |
   | `GITHUB_CLIENT_SECRET` | OAuth App client secret |
   | `TURNSTILE_SECRET_KEY` | Turnstile secret key (only with the site key) |

3. Connect Git: Workers & Pages > `lco-astro` > Settings > Build > Connect >
   GitHub > `bgross0/lco-astro`.

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Build variable | `PUBLIC_TURNSTILE_SITE_KEY` = Turnstile site key (only with the secret) |
   | Preview builds | on: Decap's draft branches get a `workers.dev` preview URL |

   Node is read from `.nvmrc` (24).
4. Push an empty commit to `main` or re-run the build, and confirm the build
   log ends with a successful deploy.

Staging stays a manual `npm run deploy:staging`. To build it from Git
instead, connect `lco-astro-staging` to the `dev` branch with the deploy
command `npx wrangler deploy --env staging`.

## 2. Test on the production Worker

On `https://lco-astro.ben-8b4.workers.dev`:

- [ ] Every page renders. Compare against the current live site.
- [ ] `/landscaping` returns a 301 to `/services/general-landscaping`, and
      `/contact` to `/contact-us`. Live URLs such as `/reviews` return 200
      with no redirect.
- [ ] **Submit one real test lead.** It must appear in the CRM (CRM > Freeform
      submissions, and as a lead), and the browser must land on `/thank-you`.
      If it errors instead, run `npx wrangler tail` and submit again. A
      Cloudflare challenge on lco.axsys.app blocking server-to-server requests
      needs a WAF skip rule for `/freeform/webhook`.
- [ ] CMS login does not work here, by design. Test it in step 6.

## 3. Add the zone to Cloudflare (do not change nameservers yet)

1. In GoDaddy, go to DNS > **Export zone file**. Keep it; it is also the
   rollback reference.
2. In Cloudflare, Add a domain > `lakecountyoutdoor.com` > Free plan. Let it
   scan, then **compare its records against the export and the table below**.
   Add anything missing.
3. **Keep the Vercel web records, DNS only (grey cloud)**: apex
   `A 216.150.1.1` and `www` CNAME to `vercel-dns`. The site keeps serving
   from Vercel through the nameserver change; step 5 replaces them.

Records that must exist before the nameserver change. Email and Microsoft
records are **DNS only (grey cloud)**; never proxy them.

| Type | Name | Content | Notes |
| --- | --- | --- | --- |
| MX | `@` | `mx1-usg1.ppe-hosted.com` (priority 0) | Proofpoint |
| MX | `@` | `mx2-usg1.ppe-hosted.com` (priority 0) | |
| MX | `@` | `mx3-usg1.ppe-hosted.com` (priority 0) | |
| TXT | `@` | `NETORGFT14700987.onmicrosoft.com` | Microsoft 365 domain verification |
| TXT | `@` | `v=spf1 include:_spf-usg1.ppe-hosted.com include:secureserver.net ~all` | SPF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | DMARC |
| CNAME | `autodiscover` | `autodiscover.outlook.com` | Outlook setup |
| CNAME | `email` | `email.secureserver.net` | GoDaddy webmail |
| CNAME | `msoid` | `clientconfig.microsoftonline-p.net` | Microsoft 365 sign-in |
| CNAME | `lyncdiscover` | `webdir.online.lync.com` | Teams/Skype |
| CNAME | `sip` | `sipdir.online.lync.com` | Teams/Skype |
| SRV | `_sip._tls` | priority 100, weight 1, port 443, `sipdir.online.lync.com` | Teams/Skype |
| SRV | `_sipfederationtls._tcp` | priority 100, weight 1, port 5061, `sipfed.online.lync.com` | Teams/Skype federation |
| A | `@` | `216.150.1.1` | Vercel, until step 5 |
| CNAME | `www` | the `vercel-dns` target from the export | Vercel, until step 5 |

No DKIM selectors were found publicly (`selector1`/`selector2._domainkey`).
If the export has any `_domainkey` records, copy them exactly.

## 4. Switch nameservers, then check email

In GoDaddy, go to Domain > Nameservers > **I'll use my own nameservers** and
enter the two Cloudflare nameservers shown for the zone.

- GoDaddy may warn that its managed Microsoft 365 DNS will no longer be
  updated automatically. That is expected; the records were copied in
  step 3. Any future Microsoft 365 DNS changes must be made in Cloudflare.
- Activation takes from minutes to a few hours. Cloudflare emails when the
  zone is active.

Once active, before touching the website:

- [ ] `dig MX lakecountyoutdoor.com @1.1.1.1` returns the three Proofpoint
      hosts.
- [ ] Send to and from an @lakecountyoutdoor.com mailbox with an outside
      address (e.g. Gmail), both directions. The headers show SPF and DMARC
      pass.
- [ ] Outlook on a phone or PC still connects (autodiscover).

If email fails, fix the records in Cloudflare (compare with the export) or
roll back the nameservers. The website is unaffected either way.

## 5. Point the domain at the Worker

Prepare the config change first, so the window between steps 2 and 3 is a
minute or two:

```jsonc
// wrangler.jsonc, top level (production)
"routes": [{ "pattern": "lakecountyoutdoor.com", "custom_domain": true }],
```

`env.staging` already sets `"routes": []`. Keep it: environments inherit
top-level routes, and without it a staging deploy would move the domain to
the staging Worker.

1. Cloudflare > DNS: delete the Vercel apex `A` and `www` CNAME records.
   A custom domain cannot be created on a hostname that still has one.
2. Add `www` as `AAAA 100::`, **proxied** (orange cloud). It exists only so
   the redirect rule below can run.
3. Commit the `routes` change to `main`. Workers Builds deploys it and creates
   the apex DNS record and certificate. (Or run `npx wrangler deploy` locally
   for the same result.)
4. Rules > Redirect Rules > create from the template **Redirect from WWW to
   root** (301, preserve query string).

CMS login only works on the apex.

## 6. Verify (same day)

- [ ] `https://lakecountyoutdoor.com` serves the new site (`server: cloudflare`,
      no `X-Robots-Tag` header).
- [ ] `www` returns a 301 to the apex, path preserved.
- [ ] `/admin` sign-in with GitHub works. Save a small draft (it opens a
      pull request), publish it, and confirm Workers Builds deploys it and the
      change appears on the site.
- [ ] Submit a test lead from the live site. It reaches the CRM.
- [ ] Email still flows (repeat one send/receive from step 4).
- [ ] Google Search Console: the sitemap `/sitemap.xml` is unchanged; resubmit
      it.

## 7. Clean up (after a few days without issues)

- Remove the domain from the Vercel project, then delete or archive that
  project.
- Keep GoDaddy as the registrar; only the nameservers moved.

## Rollback

- **Before step 5:** set the GoDaddy nameservers back to
  `ns01.domaincontrol.com` and `ns02.domaincontrol.com`. GoDaddy keeps the
  old zone until you delete it.
- **After step 5:** no nameserver change is needed. Remove the custom domain
  from the Worker (and the `routes` entry), delete the `www` AAAA record and
  the redirect rule, and re-create the Vercel records from the export (DNS
  only). Vercel serves again as long as the domain is still on the Vercel
  project, so do not remove it until step 7.
