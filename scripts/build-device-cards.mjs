// Builds the "browser + phone" previews used on the project cards (home rail and /work).
//
//   node scripts/build-device-cards.mjs <raw-dir>
//
// <raw-dir> holds full-page screenshots named
//   <slug>-desktop-full.png  (1440px wide CSS viewport, any device scale)
//   <slug>-mobile-full.png   (390px wide CSS viewport, any device scale)
// Viewport-only shots named <slug>-desktop.png / <slug>-mobile.png are used when no -full
// version exists (the card then simply doesn't scroll that screen).
//
// For each screen it writes to public/project-previews/cards/:
//   <slug>-d-poster-720.webp, -1440.webp   first 1440x900 "screen" of the page (shown at rest)
//   <slug>-d-full.webp                     the tall page, loaded on hover and scrolled through
//   <slug>-m-poster.webp, <slug>-m-full.webp  the same for the phone (390x844 screen)
// and records sizes + a tint colour per slug in src/data/deviceCards.json.
// Raw PNGs are not committed (they are large); keep them in the project files.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const raw = resolve(process.argv[2] ?? 'public/project-previews/devices-raw');
const out = new URL('../public/project-previews/cards/', import.meta.url).pathname;
const jsonUrl = new URL('../src/data/deviceCards.json', import.meta.url);
await mkdir(out, { recursive: true });

// Desktop screen = 1440x900 CSS px (16:10). Phone screen = 390x844 CSS px.
const SPEC = {
  desktop: { cssW: 1440, screenRatio: 900 / 1440, maxCssH: 5400, fullW: 1280, posterWs: [720, 1440], q: 74 },
  mobile: { cssW: 390, screenRatio: 844 / 390, maxCssH: 6000, fullW: 420, posterWs: [420], q: 78 },
};

const files = (await readdir(raw)).filter((f) => f.endsWith('.png'));
const pick = (slug, kind) => [`${slug}-${kind}-full.png`, `${slug}-${kind}.png`].find((f) => files.includes(f));
const slugs = [...new Set(files.map((f) => f.match(/^(.+)-(desktop|mobile)(-full)?\.png$/)?.[1]).filter(Boolean))].sort();

const meta = existsSync(jsonUrl) ? JSON.parse(await readFile(jsonUrl, 'utf8')) : {};
const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

for (const slug of slugs) {
  const entry = { ...(meta[slug] ?? {}) };
  for (const kind of ['desktop', 'mobile']) {
    const file = pick(slug, kind);
    if (!file) { delete entry[kind]; continue; }
    const s = SPEC[kind];
    const src = sharp(join(raw, file));
    const { width, height } = await src.metadata();
    const scale = width / s.cssW;
    const screenH = Math.round(width * s.screenRatio);
    const fullH = Math.min(height, Math.round(s.maxCssH * scale));
    const tag = kind === 'desktop' ? 'd' : 'm';

    // Poster: exactly one screen. Pad pages shorter than a screen with their bottom colour.
    const posterH = Math.min(screenH, height);
    for (const w of s.posterWs) {
      const name = s.posterWs.length > 1 ? `${slug}-${tag}-poster-${w}.webp` : `${slug}-${tag}-poster.webp`;
      await sharp(join(raw, file))
        .extract({ left: 0, top: 0, width, height: posterH })
        .resize({ width: w, height: Math.round(w * s.screenRatio), fit: 'cover', position: 'top' })
        .webp({ quality: s.q + 4 })
        .toFile(join(out, name));
    }
    // Full page (only worth it when it is taller than one screen).
    const scrolls = fullH > screenH * 1.15;
    if (scrolls) {
      await sharp(join(raw, file))
        .extract({ left: 0, top: 0, width, height: fullH })
        .resize({ width: s.fullW })
        .webp({ quality: s.q, effort: 5 })
        .toFile(join(out, `${slug}-${tag}-full.webp`));
    }
    entry[kind] = { full: scrolls, ratio: +(fullH / width).toFixed(4) };

    if (kind === 'desktop' || !entry.tint) {
      // Tint for the card backdrop: average colour of the first screen, nudged towards saturation.
      const { data } = await sharp(join(raw, file)).extract({ left: 0, top: 0, width, height: posterH }).resize(1, 1, { kernel: 'cubic' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      entry.tint = hex(...data);
    }
    if (kind === 'mobile') {
      const { data } = await sharp(join(raw, file)).extract({ left: 0, top: 0, width, height: Math.max(4, Math.round(6 * scale)) }).resize(1, 1, { kernel: 'cubic' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const [r, g, b] = data;
      entry.statusBg = hex(r, g, b);
      entry.statusInk = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55 ? '#000' : '#fff';
    }
  }
  meta[slug] = entry;
  console.log(slug, JSON.stringify(entry));
}

const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(jsonUrl, JSON.stringify(sorted, null, 2) + '\n');
console.log(`built device cards for ${slugs.length} projects`);
