// Typography for Markdown copy from the CMS (service, city and project
// bodies) inside the blocks. Tailwind utilities only; there is no
// typography plugin.
export const prose = [
  'text-muted-foreground leading-7',
  '[&_p]:mt-5 [&_p:first-child]:mt-0',
  '[&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2:first-child]:mt-0',
  '[&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:font-semibold [&_h3:first-child]:mt-0',
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:marker:text-primary',
  '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
  '[&_strong]:text-foreground [&_strong]:font-semibold',
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
].join(' ');

/**
 * Splits rendered Markdown at its headings of one level (h2 by default): the
 * copy before the first one and a section per heading (its text, id and the
 * HTML under it).
 */
export function splitSections(html: string, level: 2 | 3 = 2) {
  const tag = `h${level}`;
  const [intro, ...rest] = html.split(new RegExp(`(?=<${tag}[\\s>])`));
  const sections = rest.map((part) => {
    const match = part.match(new RegExp(`^<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
    const title = (match?.[1] ?? '').replace(/<[^>]+>/g, '').trim();
    const id = part.match(new RegExp(`^<${tag}[^>]*\\sid="([^"]+)"`))?.[1] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { id, title, html: match ? part.slice(match[0].length).trim() : part };
  });
  return { intro: intro.trim(), sections };
}
