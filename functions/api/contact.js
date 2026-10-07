// Contact form handler (Cloudflare Pages Function).
// Validates the submission, checks Turnstile, and forwards the lead to the
// CRM webhook. The webhook URL embeds a secret token, so it lives only in the
// CRM_WEBHOOK_URL secret and never in page HTML.
//
// Field names match what the CRM's atlas_submitform module already parses:
// firstName + lastName are combined into the contact name, and service is
// prepended to the lead notes.

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

  if (!env.CRM_WEBHOOK_URL) {
    console.error('CRM_WEBHOOK_URL is not set; contact form submission dropped.');
    return respond('unavailable');
  }

  try {
    const response = await fetch(env.CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'lakecountyoutdoor.com contact form' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.status !== 'success') {
      console.error('CRM did not accept the lead', response.status, JSON.stringify(result).slice(0, 500));
      return respond('unavailable');
    }
  } catch (error) {
    console.error('CRM request failed', error);
    return respond('unavailable');
  }

  return respond('ok');
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
      const body = outcome === 'ok' ? { ok: true, redirect: '/thank-you/' } : { ok: false, error: outcome };
      return Response.json(body, { status: statusFor[outcome], headers: { 'Cache-Control': 'no-store' } });
    }
    const location = outcome === 'ok' ? '/thank-you/' : `/contact/?error=${outcome}#quote-form`;
    return new Response(null, {
      status: 303,
      headers: { Location: `${origin}${location}`, 'Cache-Control': 'no-store' },
    });
  };
}
