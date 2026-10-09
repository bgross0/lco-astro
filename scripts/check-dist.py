"""Check the built site in dist/ before deploying.

Usage: python3 -I scripts/check-dist.py dist [scripts/live-urls.txt]

Fails (exit 1) when
- a local href/src/srcset/poster/url() in any HTML or CSS file points at a
  file that is not in dist,
- an internal page link lacks its trailing slash (Workers answers it with a
  307 redirect) or points at a URL that public/_redirects redirects,
- a URL from the live-site list is neither a page nor a redirect.
"""
import html
import os
import re
import sys
from urllib.parse import unquote, urlsplit

dist = sys.argv[1]
live_list = sys.argv[2] if len(sys.argv) > 2 else None
SITE = 'lakecountyoutdoor.com'
ref = re.compile(
    r'''(?:src|href|poster|content)=["']([^"']+)["']'''
    r'''|srcset=["']([^"']+)["']'''
    r'''|url\(\s*['"]?([^'")]+)['"]?\s*\)'''
)

redirects = {}
redirects_file = os.path.join(dist, '_redirects')
if os.path.exists(redirects_file):
    for line in open(redirects_file, encoding='utf-8'):
        parts = line.split()
        if len(parts) >= 2 and not parts[0].startswith('#'):
            redirects[parts[0]] = parts[1]


def exists(path):
    target = os.path.join(dist, path.lstrip('/'))
    if path.endswith('/'):
        return os.path.isfile(os.path.join(target, 'index.html'))
    return os.path.isfile(target)


missing, slashless, redirected = {}, {}, {}
for root, _, files in os.walk(dist):
    for name in files:
        if not name.endswith(('.html', '.css')):
            continue
        page = os.path.relpath(os.path.join(root, name), dist)
        text = open(os.path.join(root, name), encoding='utf-8').read()
        for match in ref.finditer(text):
            refs = [match.group(1), match.group(3)]
            if match.group(2):
                refs += [part.strip().split(' ')[0] for part in match.group(2).split(',')]
            for raw in filter(None, refs):
                url = urlsplit(html.unescape(raw))
                if url.scheme in ('http', 'https'):
                    if url.netloc != SITE:
                        continue
                elif url.scheme or url.netloc or not url.path.startswith('/'):
                    continue
                path = unquote(url.path)
                is_page = not os.path.splitext(path)[1]
                if path in redirects:
                    redirected.setdefault(path, set()).add(page)
                elif is_page and not path.endswith('/') and exists(path + '/'):
                    slashless.setdefault(path, set()).add(page)
                elif not exists(path):
                    missing.setdefault(path, set()).add(page)

live_missing = []
if live_list:
    for line in open(live_list, encoding='utf-8'):
        path = line.strip()
        if not path or path.startswith('#'):
            continue
        if not (exists(path.rstrip('/') + '/' if path != '/' else '/') or path in redirects or path + '/' in redirects):
            live_missing.append(path)

for label, found in (('MISSING', missing), ('NO TRAILING SLASH', slashless), ('LINKS TO A REDIRECT', redirected)):
    for path in sorted(found):
        print(f'{label} {path}  <- {", ".join(sorted(found[path])[:5])}')
for path in live_missing:
    print(f'LIVE URL NOT SERVED {path}')
problems = len(missing) + len(slashless) + len(redirected) + len(live_missing)
print(f'{len(missing)} missing targets, {len(slashless)} slashless page links, '
      f'{len(redirected)} links to redirects, {len(live_missing)} live URLs not served')
sys.exit(1 if problems else 0)
