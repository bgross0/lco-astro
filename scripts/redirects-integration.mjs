// Build-time guard for public/_redirects: fail the build if a redirect would
// hide a page that now exists, or points at a page that does not.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function pageExists(dist, urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  const file = path.join(dist, clean);
  return (
    fs.existsSync(path.join(file, 'index.html')) ||
    (fs.existsSync(file) && fs.statSync(file).isFile())
  );
}

export default function checkRedirects() {
  return {
    name: 'lco:check-redirects',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const file = path.join(dist, '_redirects');
        if (!fs.existsSync(file)) return;
        const problems = [];
        for (const [index, raw] of fs.readFileSync(file, 'utf8').split('\n').entries()) {
          const line = raw.trim();
          if (!line || line.startsWith('#')) continue;
          const [from, to] = line.split(/\s+/);
          if (from.includes('*') || from.includes(':')) continue;
          if (from !== '/' && pageExists(dist, from)) problems.push(`line ${index + 1}: ${from} redirects, but a page exists there`);
          if (to.startsWith('/') && !pageExists(dist, to)) problems.push(`line ${index + 1}: target ${to} does not exist`);
        }
        if (problems.length) throw new Error(`public/_redirects:\n  ${problems.join('\n  ')}`);
        logger.info('public/_redirects: every target exists and no page is shadowed');
      },
    },
  };
}
