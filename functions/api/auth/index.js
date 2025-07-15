// OAuth handler for Decap CMS on Cloudflare Pages
export async function onRequest(context) {
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
  if (url.pathname === '/api/auth') {
    const provider = url.searchParams.get('provider') || 'github';
    const scope = url.searchParams.get('scope') || 'repo,user';
    
    if (provider !== 'github') {
      return new Response('Only GitHub OAuth is supported', { status: 400 });
    }
    
    // Redirect to GitHub OAuth
    const authUrl = new URL(GITHUB_AUTH_URL);
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/callback`);
    
    return Response.redirect(authUrl.toString(), 302);
  }
  
  // Handle the callback
  if (url.pathname === '/api/auth/callback') {
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('No authorization code provided', { status: 400 });
    }
    
    try {
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
        throw new Error(tokenData.error_description || tokenData.error);
      }
      
      // Create the response HTML that posts the token back to the CMS
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authenticating...</title>
          <script>
            (function() {
              const token = '${tokenData.access_token}';
              const provider = 'github';
              
              // Post the token to the parent window
              if (window.opener) {
                window.opener.postMessage({
                  auth: { token, provider },
                }, '*');
                window.close();
              } else {
                document.body.innerHTML = '<p>Authentication successful! Please close this window.</p>';
              }
            })();
          </script>
        </head>
        <body>
          <p>Authenticating...</p>
        </body>
        </html>
      `;
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (error) {
      return new Response(`OAuth error: ${error.message}`, { status: 500 });
    }
  }
  
  return new Response('Not found', { status: 404 });
}