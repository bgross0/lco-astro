export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle the OAuth callback
  if (url.pathname === '/api/auth/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code) {
      return new Response('No code provided', { status: 400 });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return new Response(tokenData.error_description || 'Authentication failed', { status: 400 });
    }
    
    // Return the token to the CMS
    const script = `
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("receiveMessage", e);
            if (e.origin !== "${url.origin}") {
              console.log("Invalid origin:", e.origin);
              return;
            }
            
            window.opener.postMessage(
              'authorization:github:success:' + JSON.stringify({
                token: '${tokenData.access_token}',
                provider: 'github'
              }),
              e.origin
            );
            
            window.removeEventListener("message", recieveMessage, false);
          }
          
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;
    
    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
  
  // Handle the initial auth request
  if (url.pathname === '/api/auth') {
    const provider = url.searchParams.get('provider');
    
    if (provider !== 'github') {
      return new Response('Unsupported provider', { status: 400 });
    }
    
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/callback`);
    authUrl.searchParams.set('scope', 'repo,user');
    authUrl.searchParams.set('state', crypto.randomUUID());
    
    return Response.redirect(authUrl.toString(), 302);
  }
  
  return new Response('Not found', { status: 404 });
}