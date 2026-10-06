// GitHub OAuth entry point for Decap CMS (Cloudflare Pages Function).
// Decap opens this in a popup; we redirect to GitHub with a CSRF state
// that the callback verifies against an HttpOnly cookie.

const ALLOWED_SCOPES = new Set(['public_repo', 'repo']);
export const STATE_COOKIE = '__Host-decap_oauth_state';

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('CMS login is not configured.', { status: 500 });
  }

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider') ?? 'github';
  const scope = url.searchParams.get('scope') ?? 'public_repo';

  if (provider !== 'github' || !ALLOWED_SCOPES.has(scope)) {
    return new Response('Unsupported provider or scope.', { status: 400 });
  }

  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/auth/callback`);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
