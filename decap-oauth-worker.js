// Cloudflare Worker for Decap CMS OAuth
// Deploy this as a separate Worker on Cloudflare

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.SITE_URL || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // OAuth endpoints
      if (url.pathname === '/api/auth') {
        return handleAuth(url, env, corsHeaders);
      }
      
      if (url.pathname === '/api/callback') {
        return handleCallback(url, env, corsHeaders);
      }

      if (url.pathname === '/') {
        return new Response('Decap CMS OAuth Handler', { 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
        });
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  },
};

async function handleAuth(url, env, corsHeaders) {
  const provider = url.searchParams.get('provider') || 'github';
  
  if (provider !== 'github') {
    return new Response('Only GitHub provider is supported', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const state = generateState();
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  
  authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);

  // Store state in KV for verification (optional but recommended)
  // await env.OAUTH_STATE.put(state, 'pending', { expirationTtl: 600 });

  return Response.redirect(authUrl.toString(), 302);
}

async function handleCallback(url, env, corsHeaders) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  if (!code) {
    return new Response('Missing authorization code', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  // Verify state if using KV storage
  // const storedState = await env.OAUTH_STATE.get(state);
  // if (!storedState) {
  //   return new Response('Invalid state', { status: 400, headers: corsHeaders });
  // }

  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });

  const tokenData = await tokenResponse.json();
  
  if (tokenData.error) {
    return new Response(`OAuth error: ${tokenData.error_description}`, { 
      status: 400,
      headers: corsHeaders 
    });
  }

  // Get user data
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Accept': 'application/json',
    },
  });

  const userData = await userResponse.json();

  // Create the response HTML that posts the token back to the CMS
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Authorizing...</title>
    </head>
    <body>
      <script>
        const data = {
          token: '${tokenData.access_token}',
          provider: 'github',
          user: ${JSON.stringify({
            login: userData.login,
            name: userData.name,
            email: userData.email,
            avatar_url: userData.avatar_url,
          })}
        };
        
        // Post token to parent window
        if (window.opener) {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(data), 
            '${env.SITE_URL}'
          );
          window.close();
        } else {
          document.body.innerHTML = '<h1>Authorization successful!</h1><p>You can close this window.</p>';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html',
    },
  });
}

function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}