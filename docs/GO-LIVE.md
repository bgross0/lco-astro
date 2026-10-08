# Go-live: Cloudflare Workers + DNS cutover

> **Hosting moved to Workers** (see README). Where the steps below say "Pages
> project", use the `lco-astro` Worker instead: set its secrets with
> `npx wrangler secret put`, deploy with `npm run deploy:production`, and attach
> the domain under the Worker's Settings > Domains & Routes > Custom domain.
> A Git-connected setup (Workers Builds) can replace manual deploys later.

> **Not ready to run.** The live lakecountyoutdoor.com is a separate, larger
> Next.js site (about 25 services, 30 service-area pages, gallery, projects,
> reviews). Cutting over before this repo reaches content parity would replace
> it with a smaller site. Finish parity first.

Moves https://lakecountyoutdoor.com from Vercel to Cloudflare Pages and the
DNS zone from GoDaddy to Cloudflare. Email (Microsoft 365 via GoDaddy, filtered
by Proofpoint) depends on the same zone, so the DNS steps are the risky part.
Do them in order.

DNS inventory taken 2026-10-08 from public lookups (`dig`). Public lookups
cannot list every record, so step 3 starts with GoDaddy's zone export.

## 0. Prerequisites

- [ ] **Set the freeform webhook secret on the CRM.** lco.axsys.app is the
      Cobuild tenant (not the old lco-crm). Settings > Technical > System
      Parameters > `freeform.webhook_secret`: a long random value. The same
      value goes into `FREEFORM_WEBHOOK_SECRET` below. `atlas_freeform` must be
      installed on the tenant.
- [ ] **GitHub OAuth App for Decap** (see `docs/CMS.md`). Callback:
      `https://lakecountyoutdoor.com/api/auth/callback`.
- [ ] **Turnstile widget** (Cloudflare dashboard > Turnstile), hostnames
      `lakecountyoutdoor.com`, `www.lakecountyoutdoor.com`, and the
      `*.pages.dev` preview host. This gives a site key and a secret key.

## 1. Create the Pages project (Git-connected)

Use the dashboard, not `wrangler`: a Direct Upload project can never be
switched to Git later, and Decap's pull-request previews need Git.

Workers & Pages > Create > Pages > Connect to Git > `bgross0/lco-astro`

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | read from `.nvmrc` (24) |

Variables (Settings > Variables and Secrets), for **Production and Preview**:

| Name | Type | Value |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable (build) | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key |
| `FREEFORM_WEBHOOK_URL` | Secret | `https://lco.axsys.app/freeform/webhook` |
| `FREEFORM_WEBHOOK_SECRET` | Secret | same value as `freeform.webhook_secret` in Odoo |
| `GITHUB_CLIENT_ID` | Secret | OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Secret | OAuth App client secret |

## 2. Review on the preview URL

Push `dev`. Pages builds it at `https://dev.<project>.pages.dev`.

- [ ] Every page renders. Compare against the current live site.
- [ ] `/landscaping` returns a 301 to `/services/landscaping`.
- [ ] **Submit one real test lead.** It must appear in the CRM (CRM > Freeform
      submissions, and as a lead), and the browser must land on `/thank-you/`. If it errors instead, check Pages > Functions
      logs. A Cloudflare challenge on lco.axsys.app blocking server-to-server
      requests needs a WAF skip rule for `/freeform/webhook`.
- [ ] CMS login will not work here, by design. Test it after step 5.

When approved, merge `dev` into `main`. That deploys production to
`<project>.pages.dev`.

## 3. Add the zone to Cloudflare (do not change nameservers yet)

1. In GoDaddy, go to DNS > **Export zone file**. Keep it; it is also the
   rollback reference.
2. In Cloudflare, Add a domain > `lakecountyoutdoor.com` > Free plan. Let it
   scan, then **compare its records against the export and the table below**.
   Add anything missing.
3. **Delete the scanned Vercel web records** (apex `A 216.150.1.1`, `www`
   CNAME to `vercel-dns`). Pages creates the web records in step 5.

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

No DKIM selectors were found publicly (`selector1`/`selector2._domainkey`).
If the export has any `_domainkey` records, copy them exactly.

## 4. Switch nameservers

In GoDaddy, go to Domain > Nameservers > **I'll use my own nameservers** and
enter the two Cloudflare nameservers shown for the zone.

- GoDaddy may warn that its managed Microsoft 365 DNS will no longer be
  updated automatically. That is expected; the records were copied in
  step 3. Any future Microsoft 365 DNS changes must be made in Cloudflare.
- Activation takes from minutes to a few hours. Cloudflare emails when the
  zone is active.

## 5. Attach the domain to Pages

Pages project > Custom domains > add `lakecountyoutdoor.com`, then
`www.lakecountyoutdoor.com`. Then redirect `www` to the apex (Rules >
Redirect Rules, 301, preserve path and query). CMS login only works on the
apex.

## 6. Verify (same day)

- [ ] `https://lakecountyoutdoor.com` serves the new site (`server: cloudflare`).
- [ ] `www` returns a 301 to the apex.
- [ ] `/admin/` sign-in with GitHub works, and saving a draft opens a PR.
- [ ] Submit a test lead from the live site. It reaches the CRM.
- [ ] **Email:** send to and from an @lakecountyoutdoor.com mailbox with an
      outside address (e.g. Gmail), both directions. Check that the
      headers show SPF and DMARC pass.
- [ ] Outlook on a phone or PC still connects (autodiscover).
- [ ] `dig MX lakecountyoutdoor.com @1.1.1.1` returns the three Proofpoint
      hosts.

## 7. Clean up (after a few days without issues)

- Remove the domain from the Vercel project, then delete or archive that
  project.
- Keep GoDaddy as the registrar; only the nameservers moved.

## Rollback

Set the GoDaddy nameservers back to `ns01.domaincontrol.com` and
`ns02.domaincontrol.com`. GoDaddy keeps the old zone until you delete it, so
the Vercel site and email routing come back as before once the change
propagates. Do not delete the GoDaddy zone until step 7.
