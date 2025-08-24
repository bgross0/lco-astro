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
  
  // Create the success page with postMessage to communicate with CMS
  // Decap CMS expects a simple message format
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authenticating...</title>
      <script>
        (function() {
          console.log('OAuth callback - token received');
          
          // Decap CMS expects this exact format
          const message = 'authorization:github:success:${JSON.stringify({
            token: tokenData.access_token,
            provider: 'github'
          })}';
          
          console.log('Sending message:', message);
          
          // Try to send to opener (popup scenario)
          if (window.opener) {
            console.log('Posting to opener');
            window.opener.postMessage(message, window.location.origin);
            window.opener.postMessage(message, '*'); // Also try wildcard
            
            // Close after a short delay
            setTimeout(() => {
              window.close();
            }, 500);
          } 
          // If no opener, try parent (iframe scenario)
          else if (window.parent && window.parent !== window) {
            console.log('Posting to parent');
            window.parent.postMessage(message, window.location.origin);
            window.parent.postMessage(message, '*');
          }
          // Fallback: redirect with token in hash
          else {
            console.log('No opener/parent - redirecting with token');
            window.location.href = '/admin/#access_token=' + encodeURIComponent('${tokenData.access_token}');
          }
        })();
      </script>
    </head>
    <body>
      <p>Authentication successful! Redirecting...</p>
      <p>If this window doesn't close automatically, you can close it manually.</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}