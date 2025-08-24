// Google OAuth handler that provides GitHub token after email verification
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Google OAuth configuration
  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
  const ALLOWED_EMAILS = (env.ALLOWED_EMAILS || '').split(',').map(e => e.trim());
  
  if (!GOOGLE_CLIENT_ID) {
    return new Response('Google OAuth not configured', { status: 500 });
  }
  
  // Build Google OAuth URL
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${url.origin}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'select_account'
  });
  
  return Response.redirect(`${GOOGLE_AUTH_URL}?${params}`, 302);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { email, password } = await request.json();
    const ALLOWED_EMAILS = (env.ALLOWED_EMAILS || '').split(',').map(e => e.trim());
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
    const GITHUB_TOKEN = env.GITHUB_PERSONAL_TOKEN;
    
    // Simple email + password check
    if (ALLOWED_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
      // Return GitHub token for CMS to use
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script>
            const authResponse = {
              token: '${GITHUB_TOKEN}',
              provider: 'github'
            };
            
            if (window.opener) {
              window.opener.postMessage(
                'authorization:github:success:' + JSON.stringify(authResponse),
                '*'
              );
              window.close();
            }
          </script>
        </head>
        <body>Authenticating...</body>
        </html>
      `;
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Invalid credentials', { status: 401 });
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }
}