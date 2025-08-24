// OAuth handler for Decap CMS on Cloudflare Pages
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // GitHub OAuth endpoints
  const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
  const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  
  // Get environment variables
  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response('OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.', {
      status: 500,
    });
  }
  
  // Handle the initial auth request
  const provider = url.searchParams.get('provider') || 'github';
  const scope = url.searchParams.get('scope') || 'repo,user';
  
  if (provider !== 'github') {
    return new Response('Only GitHub OAuth is supported', { status: 400 });
  }
  
  // Build the callback URL - ensure it uses the correct domain
  const callbackUrl = `${url.origin}/api/auth/callback`;
  console.log('OAuth initiated - callback URL:', callbackUrl);
  console.log('OAuth initiated - client ID:', CLIENT_ID ? 'Set' : 'Missing!');
  
  // Redirect to GitHub OAuth
  const authUrl = new URL(GITHUB_AUTH_URL);
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  
  console.log('Redirecting to GitHub OAuth:', authUrl.toString());
  
  return Response.redirect(authUrl.toString(), 302);
}