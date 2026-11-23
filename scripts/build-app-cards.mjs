// Builds the three-iPhone preview used for apps that have no website (src/components/AppStage.astro).
//
//   node scripts/build-app-cards.mjs <slug> <screens-dir> [--tint=#173a30] [--side=2,3]
//
// <screens-dir> holds full-screen iPhone screenshots (any iPhone size, portrait), named so they
// sort in the order the card should step through them, with the screen's name after the number:
//   01-keypad.png, 02-active-call.png, 03-conversation.png ...
// The name becomes the image's alt text ("Reachline Mobile App: active call").
//
// Writes public/project-previews/cards/<slug>-a1.webp, -a2.webp ... (420x909, the 390x844 screen
// at about 1x) and adds { app: { screens, side }, tint } for <slug> to src/data/deviceCards.json.
// --side picks the screens (1-based) shown on the left and right phones; default 2,3.
// Needs sharp: npm i --no-save sharp
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const [slug, raw, ...flags] = process.argv.slice(2);
if (!slug || !raw) {
  console.error('usage: node scripts/build-app-cards.mjs <slug> <screens-dir> [--tint=#hex] [--side=2,3]');
  process.exit(1);
}
const flag = (name) => flags.find((f) => f.startsWith(`--${name}=`))?.split('=')[1];
const out = new URL('../public/project-previews/cards/', import.meta.url);
const jsonUrl = new URL('../src/data/deviceCards.json', import.meta.url);
await mkdir(out, { recursive: true });

const files = (await readdir(raw)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
if (files.length < 3) throw new Error('need at least 3 screenshots');

const W = 420;
const H = Math.round((W * 844) / 390);
const screens = [];
for (const [i, file] of files.entries()) {
  await sharp(join(raw, file))
    .resize({ width: W, height: H, fit: 'cover', position: 'top' })
    .webp({ quality: 82, effort: 5 })
    .toFile(new URL(`${slug}-a${i + 1}.webp`, out).pathname);
  const alt = file.replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim();
  screens.push({ alt });
}

const side = (flag('side') ?? '2,3').split(',').map((n) => Number(n) - 1);
const meta = JSON.parse(await readFile(jsonUrl, 'utf8'));
meta[slug] = { app: { screens, side }, tint: flag('tint') ?? meta[slug]?.tint ?? '#1f3a30' };
const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(jsonUrl, JSON.stringify(sorted, null, 2) + '\n');
console.log(slug, JSON.stringify(meta[slug]));
