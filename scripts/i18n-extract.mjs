// Lists English text that still needs a Georgian or Russian translation.
//   npm run build && node scripts/i18n-extract.mjs [outDir]
// Writes one TSV per page group (key, kind, English text). Keys already present in
// src/i18n/translations/*.json for both languages are skipped.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { walk } from '../src/i18n/engine.ts';

const dist = 'dist';
const out = process.argv[2] ?? 'i18n-todo';
const done = new Set();
const all = new Map();
for (const f of readdirSync('src/i18n/translations')) {
  if (!f.endsWith('.json')) continue;
  for (const [k, v] of Object.entries(JSON.parse(readFileSync(join('src/i18n/translations', f), 'utf8')))) {
    all.set(k, { v, f });
    if (Array.isArray(v) ? v.length === 2 : v && typeof v.ka === 'string' && typeof v.ru === 'string') done.add(k);
  }
}

const pages = [];
const scan = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const rel = relative(dist, p);
    if (/^(ka|ru)(\/|$)/.test(rel) || rel === '404.html' || rel.startsWith('chvenori')) continue;
    if (statSync(p).isDirectory()) scan(p);
    else if (f.endsWith('.html')) pages.push(rel);
  }
};
scan(dist);
const rank = (p) => (p === 'index.html' ? 0 : p.startsWith('work/index') ? 1 : p.startsWith('work/') ? 2 : p.startsWith('offers/') ? 3 : p === 'affiliate/index.html' ? 4 : 5);
pages.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

mkdirSync(out, { recursive: true });
const seen = new Set();
const used = new Set();
const problems = [];
let total = 0;
pages.forEach((page, i) => {
  const rows = [];
  walk(readFileSync(join(dist, page), 'utf8'), (seg) => {
    const id = seg.kind === 'script' ? `s:${seg.key}` : seg.key;
    const known = all.get(id);
    if (known && !seen.has(id)) {
      // Every inline-tag marker of the English text must survive in each translation.
      const want = (seg.text.match(/⟨\d+⟩/g) ?? []).sort().join();
      const vals = Array.isArray(known.v) ? known.v : [known.v.ka, known.v.ru];
      vals.forEach((t, li) => {
        if (typeof t === 'string' && seg.kind === 'text' && (t.match(/⟨\d+⟩/g) ?? []).sort().join() !== want) problems.push(`${known.f} ${id} [${li ? 'ru' : 'ka'}] markers differ from: ${seg.text}`);
      });
      used.add(id);
    }
    if (seen.has(id) || done.has(id)) return undefined;
    seen.add(id);
    rows.push(`${id}\t${seg.kind}\t${seg.text.replace(/\n/g, '\\n')}`);
    return undefined;
  });
  if (!rows.length) return;
  total += rows.length;
  const name = `${String(i).padStart(3, '0')}-${page.replace(/\/index\.html$|\.html$/, '').replace(/\//g, '_') || 'home'}.tsv`;
  writeFileSync(join(out, name), rows.join('\n') + '\n');
});
for (const [k, { f }] of all) if (/^(s:)?[0-9a-f]{10}$/.test(k) && !used.has(k)) problems.push(`${f} ${k} is not used on any page (stale?)`);
problems.forEach((p) => console.warn(p));
console.log(`${total} untranslated segments in ${pages.length} pages → ${out}/`);
