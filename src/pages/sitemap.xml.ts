import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { guides, hub } from '../data/guides';

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
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
