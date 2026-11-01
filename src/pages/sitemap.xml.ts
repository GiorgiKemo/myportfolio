import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { guides, hub } from '../data/guides';
import { languages, langs, localizePath } from '../i18n/config';

const SITE = 'https://giorgi.codes';
const today = new Date().toISOString().slice(0, 10);

export const GET: APIRoute = () => {
  const urls: { loc: string; lastmod: string; priority: number }[] = [
    { loc: '/', lastmod: today, priority: 1.0 },
    { loc: '/work/', lastmod: today, priority: 0.8 },
    ...projects.map((p) => ({ loc: `/work/${p.slug}/`, lastmod: today, priority: 0.7 })),
    { loc: hub.href, lastmod: hub.updated, priority: hub.priority },
    ...guides.map((g) => ({ loc: g.href, lastmod: g.updated, priority: g.priority })),
    { loc: '/offers/conversion-snapshot.html', lastmod: today, priority: 0.5 },
  ];
  // Every page exists in each language; each entry lists all versions as alternates.
  const alternates = (loc: string) =>
    [
      ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${languages[l].hreflang}" href="${SITE}${localizePath(loc, l)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${loc}"/>`,
    ].join('\n');
  const entries = urls.flatMap((u) =>
    langs.map(
      (l) =>
        `  <url>\n    <loc>${SITE}${localizePath(u.loc, l)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${(l === 'en' ? u.priority : u.priority * 0.9).toFixed(1)}</priority>\n${alternates(u.loc)}\n  </url>`,
    ),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
