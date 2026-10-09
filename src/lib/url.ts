/**
 * The public, slashless path of the page being rendered. With
 * build.format 'file' Astro.url ends in .html (/reviews.html, /index.html);
 * the site serves those at /reviews and /.
 */
export function pagePath(url: URL): string {
  const path = url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '');
  return path || '/';
}

/** schema.org BreadcrumbList for the visible breadcrumb trail. */
export function breadcrumbList(items: { label: string; href: string }[], site: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href, site).href,
    })),
  };
}
