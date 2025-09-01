export function onRequest({ url, redirect }, next) {
  // Redirect old service URLs to new ones
  const redirects = {
    '/commercial-snow-removal': '/services/commercial-snow-removal',
    '/landscaping': '/services/landscaping',
    '/municipal-contracting': '/services/municipal-contracting',
    '/ice-management': '/services/ice-management',
  };

  const pathname = url.pathname;
  
  if (redirects[pathname]) {
    return redirect(redirects[pathname], 301);
  }

  return next();
}