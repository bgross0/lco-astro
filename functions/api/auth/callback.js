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
  
  // Return HTML that will post the message to the opener window
  // This is the exact format that Decap CMS expects based on working implementations
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authenticating...</title>
    </head>
    <body>
      <script>
        const token = '${tokenData.access_token}';
        const message = 'authorization:github:success:' + JSON.stringify({ token: token });
        
        console.log('Sending message to opener:', message);
        
        if (window.opener) {
          window.opener.postMessage(message, '*');
          window.close();
        } else {
          // Fallback: redirect with token in hash
          window.location.href = '${url.origin}/admin/#access_token=' + encodeURIComponent(token) + '&token_type=bearer';
        }
      </script>
      <p>Authentication successful. This window should close automatically.</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}