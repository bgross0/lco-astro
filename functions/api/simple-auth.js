// Simple password-based auth for Decap CMS
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Set your password in Cloudflare env variables
  const ADMIN_PASSWORD = env.CMS_PASSWORD || 'change-this-password';
  const GITHUB_TOKEN = env.GITHUB_PERSONAL_TOKEN; // Personal access token from GitHub
  
  try {
    const { password } = await request.json();
    
    if (password === ADMIN_PASSWORD) {
      // Return the GitHub token for CMS to use
      return new Response(JSON.stringify({
        token: GITHUB_TOKEN,
        provider: 'github'
      }), {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else {
      return new Response('Invalid password', { status: 401 });
    }
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }
}