import { defineMiddleware } from 'astro:middleware';
import { isLang, defaultLang } from './i18n/config.ts';
import { translateHtml } from './i18n/engine.ts';
import { dictionary } from './i18n/dictionary.ts';
import { patterns } from './i18n/patterns.ts';

const reported = new Set<string>();

// Pages under /ka/ and /ru/ render the English templates; this swaps in the translations.
export const onRequest = defineMiddleware(async (ctx, next) => {
  const lang = ctx.url.pathname.split('/')[1];
  const res = await next();
  if (!isLang(lang) || lang === defaultLang) return res;
  if (!(res.headers.get('content-type') ?? 'text/html').includes('text/html')) return res;
  const html = await res.text();
  const out = translateHtml(html, lang, dictionary(lang), patterns, (seg) => {
    const id = `${lang}:${seg.key}`;
    if (process.env.I18N_REPORT && !reported.has(id)) {
      reported.add(id);
      console.warn(`[i18n] missing ${lang} ${seg.kind} ${seg.key}: ${seg.text.slice(0, 90)}`);
    }
  });
  return new Response(out, { status: res.status, headers: res.headers });
});
