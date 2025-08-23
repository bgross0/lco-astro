// OAuth callback handler for Decap CMS
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  
  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('No code provided', { status: 400 });
  }
  
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
  
  if (tokenData.error) {
    return new Response(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`, {
      status: 400,
    });
  }
  
  // Create the success page with postMessage to communicate with CMS
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authenticating...</title>
      <script>
        const authResponse = {
          token: '${tokenData.access_token}',
          provider: 'github'
        };
        
        if (window.opener) {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(authResponse),
            window.location.origin
          );
          window.close();
        } else {
          document.body.innerHTML = '<p>Authentication successful! This window should close automatically.</p>';
          setTimeout(() => window.close(), 2000);
        }
      </script>
    </head>
    <body>
      <p>Authenticating...</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}