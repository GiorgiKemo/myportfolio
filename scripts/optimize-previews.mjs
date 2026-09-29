// Generates responsive WebP versions of the project preview screenshots.
// Run after adding a new preview: `node scripts/optimize-previews.mjs`
import { readdir } from 'node:fs/promises';
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
