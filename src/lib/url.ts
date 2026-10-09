/**
 * The public, slashless path of the page being rendered. With
 * build.format 'file' Astro.url ends in .html (/reviews.html, /index.html);
 * the site serves those at /reviews and /.
 */
export function pagePath(url: URL): string {
  const path = url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '');
  return path || '/';
}
