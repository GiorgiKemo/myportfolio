// Generates responsive WebP versions of the project preview screenshots.
// Run after adding a new preview: `node scripts/optimize-previews.mjs`
//
// public/project-previews/*.png          -> <name>-720.webp, <name>-1440.webp (cards, OG)
// public/project-previews/devices/*.png  -> MacBook + phone mock-up screenshots:
//   <slug>-desktop.png (1440x810 viewport @2x) -> <slug>-desktop-960.webp, -1920.webp
//   <slug>-mobile.png  (390x764 viewport @3x)  -> <slug>-mobile-480.webp, -960.webp
//   and src/data/devicePreviews.json with the phone status-bar colours, sampled from
//   the top edge of each phone screenshot so the status bar blends into the page.
// The raw device PNGs are git-ignored: drop new ones in, run this script, commit the WebP + JSON.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dir = new URL('../public/project-previews/', import.meta.url).pathname;
const files = (await readdir(dir)).filter((f) => f.endsWith('.png'));
for (const file of files) {
  const base = file.replace(/\.png$/, '');
  for (const width of [720, 1440]) {
    await sharp(join(dir, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(join(dir, `${base}-${width}.webp`));
  }
}
console.log(`optimized ${files.length} previews`);

const devDir = join(dir, 'devices');
if (existsSync(devDir)) {
  const shots = (await readdir(devDir)).filter((f) => f.endsWith('.png'));
  // Raw PNGs are not committed, so keep entries for slugs whose PNG is not present this run.
  const jsonUrl = new URL('../src/data/devicePreviews.json', import.meta.url);
  const meta = existsSync(jsonUrl) ? JSON.parse(await readFile(jsonUrl, 'utf8')) : {};
  for (const file of shots) {
    const [, slug, kind] = file.match(/^(.+)-(desktop|mobile)\.png$/) ?? [];
    if (!slug) continue;
    const widths = kind === 'desktop' ? [960, 1920] : [480, 960];
    for (const width of widths) {
      await sharp(join(devDir, file))
        .resize({ width })
        .webp({ quality: kind === 'desktop' ? 80 : 82 })
        .toFile(join(devDir, `${slug}-${kind}-${width}.webp`));
    }
    if (kind === 'mobile') {
      const img = sharp(join(devDir, file));
      const { width } = await img.metadata();
      const { data } = await img.extract({ left: 0, top: 0, width, height: 6 }).resize(1, 1, { kernel: 'cubic' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const [r, g, b] = data;
      const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      meta[slug] = { statusBg: hex, statusInk: lum > 0.55 ? '#000000' : '#ffffff' };
    }
  }
  const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(jsonUrl, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`optimized ${shots.length} device screenshots`);
}
