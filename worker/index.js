// Cloudflare Worker entry. Static pages are served straight from the assets
// binding (with public/_headers and public/_redirects applied); wrangler.jsonc
// routes only /api/* here, via assets.run_worker_first.
//
// The handlers keep the Pages Functions signature ({ request, env }), so the
// same modules in functions/api/ serve both.

import { onRequestPost as contact } from '../functions/api/contact.js';
import { onRequestGet as authStart } from '../functions/api/auth.js';
import { onRequestGet as authCallback } from '../functions/api/auth/callback.js';

const routes = {
  '/api/contact': { POST: contact },
  '/api/auth': { GET: authStart },
  '/api/auth/callback': { GET: authCallback },
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const route = routes[pathname.replace(/\/$/, '')];

    if (!route) {
      return pathname.startsWith('/api/')
        ? new Response('Not found', { status: 404 })
        : env.ASSETS.fetch(request);
    }

    const handler = route[request.method];
    if (!handler) {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: Object.keys(route).join(', ') },
      });
    }
    return handler({ request, env, ctx });
  },
};
