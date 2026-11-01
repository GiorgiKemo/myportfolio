// Loads every translation file in ./translations. Each file maps a segment key
// (see engine.ts keyOf) to [ka, ru] (or { ka, ru }); script-literal keys are prefixed with "s:".
// `node scripts/i18n-extract.mjs` lists the English text behind each key that is still missing.
import type { Lang } from './config.ts';
import type { Translations } from './engine.ts';

type Entry = [string | null, string | null] | Partial<Record<Lang, string>>;
const files = import.meta.glob<{ default: Record<string, Entry> }>('./translations/*.json', { eager: true });

const cache = new Map<Lang, Translations>();
export function dictionary(lang: Lang): Translations {
  let d = cache.get(lang);
  if (!d) {
    d = {};
    for (const f of Object.values(files)) {
      for (const [k, v] of Object.entries(f.default)) {
        const t = Array.isArray(v) ? v[lang === 'ka' ? 0 : 1] : v?.[lang];
        if (typeof t === 'string') d[k] = t;
      }
    }
    cache.set(lang, d);
  }
  return d;
}
