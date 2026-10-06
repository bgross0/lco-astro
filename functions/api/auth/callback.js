// GitHub OAuth callback for Decap CMS (Cloudflare Pages Function).
// Verifies the CSRF state, exchanges the code for a token, and hands the
// result back to the Decap window via its postMessage handshake. The
// token is only ever posted to this site's own origin.

import { STATE_COOKIE } from '../auth.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = readCookie(request, STATE_COOKIE);

  if (url.searchParams.get('error')) {
    return reply(url.origin, 'error', {
      message: url.searchParams.get('error_description') ?? 'Authorization was denied.',
    });
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return reply(url.origin, 'error', { message: 'Invalid or expired login attempt. Please try again.' });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'lco-decap-oauth',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth/callback`,
    }),
  });

  const data = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || data.error || !data.access_token) {
    return reply(url.origin, 'error', {
      message: data.error_description ?? 'GitHub token exchange failed.',
    });
  }

  return reply(url.origin, 'success', { token: data.access_token, provider: 'github' });
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

// Decap's handshake: the popup announces "authorizing:github", the CMS
// window answers, and only then is the result posted back. The origin of
// that answer must match this site, otherwise any page that opened this
// popup could receive the token.
function reply(origin, status, payload) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Signing in…</title></head>
<body>
<p>${status === 'success' ? 'Signed in. This window will close.' : 'Sign-in failed. You can close this window.'}</p>
<script nonce="${nonce}">
(function () {
  var origin = ${toScriptLiteral(origin)};
  var message = ${toScriptLiteral(message)};
  if (!window.opener) return;
  window.addEventListener('message', function (event) {
    if (event.origin !== origin || event.data !== 'authorizing:github') return;
    window.opener.postMessage(message, origin);
    setTimeout(function () { window.close(); }, 100);
  });
  window.opener.postMessage('authorizing:github', origin);
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: status === 'success' ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'`,
      'Set-Cookie': `${STATE_COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}

// JSON.stringify is not safe inside <script> on its own: escape characters
// that could close the tag or break the JS string.
function toScriptLiteral(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
