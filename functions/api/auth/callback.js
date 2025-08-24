// OAuth callback handler for Decap CMS
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  
  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  
  const code = url.searchParams.get('code');
  
  if (!code) {
    console.error('OAuth callback: No code provided');
    return new Response('No code provided', { status: 400 });
  }
  
  console.log('OAuth callback: Exchanging code for token...');
  
  // Exchange code for access token
  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
    }),
  });
  
  const tokenData = await tokenResponse.json();
  console.log('OAuth callback: Token response received', tokenData.access_token ? 'Token present' : 'No token');
  
  if (tokenData.error) {
    return new Response(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`, {
      status: 400,
    });
  }
  
  // Fuck postMessage - just redirect with the token
  // This is simpler and more reliable
  const redirectUrl = `${url.origin}/admin/#access_token=${tokenData.access_token}&token_type=bearer&provider=github`;
  
  return Response.redirect(redirectUrl, 302);
}