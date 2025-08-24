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
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authenticating...</title>
      <script>
        (function() {
          const authResponse = {
            token: '${tokenData.access_token}',
            provider: 'github'
          };
          
          console.log('Auth callback executing...');
          
          // Try multiple message formats for compatibility
          const message = 'authorization:github:success:' + JSON.stringify(authResponse);
          
          if (window.opener) {
            console.log('Posting message to opener...');
            // Post to the opener with the origin
            window.opener.postMessage(message, '*');
            
            // Also try the specific format Decap CMS expects
            window.opener.postMessage({
              auth: {
                token: '${tokenData.access_token}',
                provider: 'github'
              }
            }, '*');
            
            setTimeout(() => {
              window.close();
            }, 100);
          } else if (window.parent && window.parent !== window) {
            console.log('Posting message to parent...');
            window.parent.postMessage(message, '*');
            window.parent.postMessage({
              auth: {
                token: '${tokenData.access_token}',
                provider: 'github'
              }
            }, '*');
          } else {
            console.log('No opener or parent found');
            document.body.innerHTML = '<p>Authentication successful! You can close this window.</p>';
          }
        })();
      </script>
    </head>
    <body>
      <p>Authenticating... This window should close automatically.</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}