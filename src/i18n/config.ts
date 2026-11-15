// Languages served by the site. English lives at the root (unchanged URLs);
// every other language mirrors the same paths under /<code>/.
export const languages = {
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US', hreflang: 'en' },
  ka: { label: 'ქართული', short: 'KA', htmlLang: 'ka', ogLocale: 'ka_GE', hreflang: 'ka' },
  ru: { label: 'Русский', short: 'RU', htmlLang: 'ru', ogLocale: 'ru_RU', hreflang: 'ru' },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];
/** Languages that live under a /<code>/ prefix. */
export const prefixedLangs = langs.filter((l) => l !== defaultLang);

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && v in languages;

/**
 * Turn a root-relative English path into the same page in `lang`.
 * External links, mailto:, tel: and pure hashes are returned untouched.
 */
export function localizePath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (/^\/(ka|ru)(\/|$|\?|#)/.test(path)) return path;
  // Static assets keep their single location.
  if (/^\/(affiliate\/assets|project-previews|stills|og|_astro|build)\//.test(path)) return path;
  if (/\.(png|jpe?g|webp|avif|svg|ico|js|css|xml|txt|pdf|woff2?)(\?|#|$)/.test(path)) return path;
  return `/${lang}${path}`;
}

/** Strip a language prefix, giving the English path. */
export function basePath(path: string): string {
  return path.replace(/^\/(ka|ru)(?=\/|$)/, '') || '/';
}

/** Rewrite every internal href="/..." inside an HTML string. */
export function localizeHtmlLinks(html: string, lang: Lang): string {
  if (lang === defaultLang) return html;
  return html.replace(/(\shref=)(["'])(\/[^"']*)\2/g, (_m, pre, q, url) => `${pre}${q}${localizePath(url, lang)}${q}`);
}

/** Language of a rendered page, from its URL. */
export const langOf = (url: URL): Lang => {
  const seg = url.pathname.split('/')[1];
  return isLang(seg) ? seg : defaultLang;
};
