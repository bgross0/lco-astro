// Contact form handler (Cloudflare Pages Function).
// Validates the submission, checks Turnstile, and delivers it to the Cobuild
// tenant's atlas_freeform webhook (POST /freeform/webhook), signed with the
// shared secret in FREEFORM_WEBHOOK_SECRET. Nothing secret reaches page HTML.
//
// The payload uses keys atlas_freeform auto-maps onto a CRM lead: name,
// email, phone, company, address and message; subject becomes the lead title.
// atlas_freeform stores every delivery as a freeform.submission first (the
// ADR-0040 staging model), so this path does not bypass it. There is no queue
// in front of Odoo: if delivery fails, the visitor is told and asked to call.

// Stable id for this form in atlas_freeform; the form record is created on
// first delivery. Changing it creates a new form (and new field mappings).
const FORM_ID = '317ed959-d887-4366-b851-1e5d79394c54';

const FIELDS = {
  firstName: { max: 100, required: true },
  lastName: { max: 100, required: true },
  email: { max: 254, required: true },
  phone: { max: 40 },
  company: { max: 200 },
  service: { max: 100, required: true },
  message: { max: 5000, required: true },
};
const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const respond = responder(request);

  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
    return respond('invalid');
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return respond('invalid');
  }

  // Honeypot: hidden from people, filled in by naive bots. Pretend it worked.
  if (form.get('website')) return respond('ok');

  const lead = {};
  for (const [name, rule] of Object.entries(FIELDS)) {
    const value = String(form.get(name) ?? '').trim();
    if (value.length > rule.max || (rule.required && !value)) return respond('invalid');
    if (value) lead[name] = value;
  }
  if (!EMAIL_PATTERN.test(lead.email)) return respond('invalid');

  if (env.TURNSTILE_SECRET_KEY) {
    const human = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      form.get('cf-turnstile-response'),
      request.headers.get('CF-Connecting-IP'),
    );
    if (!human) return respond('verification');
  } else {
    console.warn('TURNSTILE_SECRET_KEY is not set; the contact form relies on the honeypot only.');
  }

  if (!env.FREEFORM_WEBHOOK_URL || !env.FREEFORM_WEBHOOK_SECRET) {
    console.error('FREEFORM_WEBHOOK_URL or FREEFORM_WEBHOOK_SECRET is not set; submission not delivered.');
    return respond('unavailable');
  }

  const submissionId = crypto.randomUUID();
  const body = JSON.stringify({
    form_data: {
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      ...(lead.phone && { phone: lead.phone }),
      ...(lead.company && { company: lead.company }),
      subject: `${lead.service} quote request`,
      message: `Service: ${lead.service}\n\n${lead.message}`,
    },
    meta: {
      form_id: FORM_ID,
      submission_id: submissionId,
      submitted_at: new Date().toISOString(),
      ip_address: request.headers.get('CF-Connecting-IP') ?? '',
      tracking: { landing_page: request.headers.get('Referer') ?? '' },
    },
  });

  try {
    const response = await fetch(env.FREEFORM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'website contact form',
        'X-Freeform-Delivery': submissionId,
        'X-Freeform-Signature': await sign(env.FREEFORM_WEBHOOK_SECRET, body),
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json().catch(() => ({}));
    // "duplicate" means this delivery id was already stored: a success.
    if (!response.ok || !['success', 'duplicate'].includes(result.status)) {
      console.error('CRM did not accept the submission', submissionId, response.status, JSON.stringify(result).slice(0, 500));
      return respond('unavailable');
    }
  } catch (error) {
    console.error('CRM request failed', submissionId, error);
    return respond('unavailable');
  }

  return respond('ok');
}

// Stripe-style signature atlas_freeform verifies: t=<unix seconds>,
// v1=hex(HMAC-SHA256(secret, "<t>.<raw body>")).
async function sign(secret, body) {
  const timestamp = Math.floor(Date.now() / 1000);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `t=${timestamp},v1=${hex}`;
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification failed', error);
    return false;
  }
}

// The page submits with fetch (Accept: application/json) so a failure keeps
// what the visitor typed; a plain form post falls back to redirects.
function responder(request) {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const origin = new URL(request.url).origin;
  const statusFor = { ok: 200, invalid: 400, verification: 400, unavailable: 502 };

  return (outcome) => {
    if (wantsJson) {
      const body = outcome === 'ok' ? { ok: true, redirect: '/thank-you' } : { ok: false, error: outcome };
      return Response.json(body, { status: statusFor[outcome], headers: { 'Cache-Control': 'no-store' } });
    }
    const location = outcome === 'ok' ? '/thank-you' : `/contact-us?error=${outcome}#quote-form`;
    return new Response(null, {
      status: 303,
      headers: { Location: `${origin}${location}`, 'Cache-Control': 'no-store' },
    });
  };
}
