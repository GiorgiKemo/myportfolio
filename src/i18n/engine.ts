// Build-time HTML translation.
//
// English pages are the source of truth. For /ka/ and /ru/ the same page is rendered, then this
// module swaps every text "segment" (a run of text with its inline markup) and every visible
// attribute for its translation, rewrites internal links to the localized URLs, and translates
// JSON-LD and inline-script strings. Markup, classes, ids and affiliate attributes are never
// touched: inline tags travel through translations as numbered markers (⟨0⟩, ⟨1⟩ …).
//
// The same walker drives `scripts/i18n-extract.mjs`, which lists the English segments to translate.

import { createHash } from 'node:crypto';
import { localizePath, type Lang } from './config.ts';

export type Translations = Record<string, string>;

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'br', 'cite', 'code', 'del', 'em', 'i', 'ins', 'kbd', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'wbr', 'output', 'data']);
/** Elements whose content is never translated. */
const SKIP = new Set(['style', 'svg', 'pre', 'code', 'kbd', 'textarea', 'template', 'noscript']);
const TEXT_ATTRS = ['alt', 'title', 'aria-label', 'placeholder', 'data-cursor'];
const META_KEYS = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description)$/;
const SITE = 'https://giorgi.codes';

export const keyOf = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 10);
/** Normalized lookup form of a piece of text. */
export const norm = (s: string) => decode(s).replace(/\s+/g, ' ').trim();

const decode = (s: string) =>
  s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp|apos);/g, (_m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'", nbsp: ' ', apos: "'" })[e as string] ?? _m);
const escText = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, '&amp;').replace(/</g, '&lt;');
const escAttr = (s: string) => escText(s).replace(/"/g, '&quot;');
const hasWords = (s: string) => /\p{L}{2,}/u.test(s);

interface Tok { kind: 'text' | 'open' | 'close' | 'other'; raw: string; name?: string; }
interface Node { tok?: number; end?: number; name: string; children: (Node | number)[]; }

function tokenize(html: string): Tok[] {
  const toks: Tok[] = [];
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?([a-zA-Z][\w:-]*)(?:\s(?:[^>"']|"[^"]*"|'[^']*')*)?\/?>/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m.index > last) toks.push({ kind: 'text', raw: html.slice(last, m.index) });
    const raw = m[0];
    if (!m[1]) toks.push({ kind: 'other', raw });
    else if (raw[1] === '/') toks.push({ kind: 'close', raw, name: m[1].toLowerCase() });
    else toks.push({ kind: 'open', raw, name: m[1].toLowerCase() });
    last = re.lastIndex;
    // Raw-text elements: swallow content up to the matching close tag.
    const name = m[1]?.toLowerCase();
    if (raw[1] !== '/' && (name === 'script' || name === 'style')) {
      const close = html.toLowerCase().indexOf(`</${name}`, last);
      const stop = close === -1 ? html.length : close;
      if (stop > last) toks.push({ kind: 'text', raw: html.slice(last, stop), name: `#${name}` });
      last = stop;
      re.lastIndex = stop;
    }
  }
  if (last < html.length) toks.push({ kind: 'text', raw: html.slice(last) });
  return toks;
}

function buildTree(toks: Tok[]): Node {
  const root: Node = { name: '#root', children: [] };
  const stack: Node[] = [root];
  toks.forEach((t, i) => {
    const top = stack[stack.length - 1];
    if (t.kind === 'open') {
      const node: Node = { tok: i, name: t.name!, children: [] };
      top.children.push(node);
      if (!VOID.has(t.name!) && !t.raw.endsWith('/>')) stack.push(node);
    } else if (t.kind === 'close') {
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].name === t.name) {
          stack[s].end = i;
          stack.length = s;
          break;
        }
      }
    } else top.children.push(i);
  });
  return root;
}

const attrRe = (name: string) => new RegExp(`(\\s${name}=)(["'])(.*?)\\2`, 'is');
const getAttr = (raw: string, name: string) => raw.match(attrRe(name))?.[3];

export interface Segment { key: string; text: string; kind: 'text' | 'attr' | 'script' | 'json'; }

type Visit = (seg: Segment) => string | undefined;

/** Walks a full HTML page, calling `visit` for each translatable piece. Returns the rewritten HTML. */
export function walk(html: string, visit: Visit, lang?: Lang): string {
  const toks = tokenize(html);
  const root = buildTree(toks);
  const out = toks.map((t) => t.raw);
  const firstTok = (n: Node | number): number => (typeof n === 'number' ? n : n.tok!);
  const lastTok = (n: Node | number): number => (typeof n === 'number' ? n : (n.end ?? lastTok(n.children[n.children.length - 1] ?? n.tok!)));

  // 1. Tags: visible attributes + internal links.
  toks.forEach((t, i) => {
    if (t.kind !== 'open') return;
    let raw = t.raw;
    for (const a of TEXT_ATTRS) {
      const v = getAttr(raw, a);
      if (v && hasWords(v)) {
        const tr = visit({ key: keyOf(norm(v)), text: norm(v), kind: 'attr' });
        if (tr) raw = raw.replace(attrRe(a), (_m, pre, q) => `${pre}${q}${escAttr(tr)}${q}`);
      }
    }
    if (t.name === 'meta') {
      const k = getAttr(raw, 'name') ?? getAttr(raw, 'property') ?? '';
      const v = getAttr(raw, 'content');
      if (META_KEYS.test(k) && v && hasWords(v)) {
        const tr = visit({ key: keyOf(norm(v)), text: norm(v), kind: 'attr' });
        if (tr) raw = raw.replace(attrRe('content'), (_m, pre, q) => `${pre}${q}${escAttr(tr)}${q}`);
      }
    }
    if (lang && !/\sdata-lang-link/.test(raw)) {
      raw = raw.replace(/(\shref=)(["'])(\/[^"']*)\2/, (_m, pre, q, url) => `${pre}${q}${localizePath(url, lang)}${q}`);
    }
    out[i] = raw;
  });

  // 2. Script bodies: JSON(-LD) values and inline-script string literals.
  toks.forEach((t, i) => {
    if (t.name !== '#script') return;
    const open = toks[i - 1]?.raw ?? '';
    if (/\ssrc=/.test(open)) return;
    const type = getAttr(open, 'type') ?? '';
    if (/json/.test(type)) out[i] = translateJson(t.raw, visit, lang);
    else out[i] = translateScript(t.raw, visit);
  });

  // 3. Text segments.
  const visitNode = (node: Node) => {
    if (SKIP.has(node.name)) return;
    let run: (Node | number)[] = [];
    const flush = () => {
      const r = run;
      run = [];
      if (!r.length) return;
      const direct = r.some((c) => typeof c === 'number' && toks[c].kind === 'text' && !toks[c].name && hasWords(toks[c].raw));
      if (!direct) {
        r.forEach((c) => typeof c !== 'number' && visitNode(c));
        return;
      }
      const a = firstTok(r[0]);
      const b = lastTok(r[r.length - 1]);
      const tags: string[] = [];
      let text = '';
      for (let i = a; i <= b; i++) {
        const t = toks[i];
        if (t.kind === 'text') text += t.raw;
        else { text += `⟨${tags.length}⟩`; tags.push(out[i]); }
      }
      const lead = text.match(/^\s*/)![0];
      const trail = text.match(/\s*$/)![0];
      const key = norm(text);
      const tr = visit({ key: keyOf(key), text: key, kind: 'text' });
      if (!tr) return;
      const used = new Set<number>();
      let html = escText(tr).replace(/⟨(\d+)⟩/g, (_m, n) => { used.add(+n); return tags[+n] ?? ''; });
      // A translation that lost an inline tag would break the markup: keep English instead.
      if (used.size !== tags.length) return;
      out[a] = lead + html + trail;
      for (let i = a + 1; i <= b; i++) out[i] = '';
    };
    for (const c of node.children) {
      const isInlineEl = typeof c !== 'number' && INLINE.has(c.name) && !SKIP.has(c.name);
      const isText = typeof c === 'number' && toks[c].kind === 'text' && !toks[c].name;
      if (isInlineEl || isText) run.push(c);
      else {
        flush();
        if (typeof c !== 'number') visitNode(c);
      }
    }
    flush();
  };
  visitNode(root);
  return out.join('');
}

function translateJson(src: string, visit: Visit, lang?: Lang): string {
  let data: unknown;
  try { data = JSON.parse(src); } catch { return src; }
  const fix = (v: unknown, k?: string): unknown => {
    if (typeof v === 'string') {
      if (lang && v.startsWith(SITE + '/')) return SITE + localizePath(v.slice(SITE.length), lang);
      if (lang && k === 'h' && v.startsWith('/')) return localizePath(v, lang);
      if (k === 'inLanguage' && lang) return lang;
      if (k && /^(@|url$|item$|image$|logo$|sameAs$|email$|telephone$)/.test(k)) return v;
      if (!hasWords(v)) return v;
      const tr = visit({ key: keyOf(norm(v)), text: norm(v), kind: 'json' });
      return tr ? tr.replace(/⟨\d+⟩/g, '') : v;
    }
    if (Array.isArray(v)) return v.map((x) => fix(x, k));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([kk, vv]) => [kk, fix(vv, kk)]));
    return v;
  };
  return JSON.stringify(fix(data)).replace(/</g, '\\u003c');
}

const LIT = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;

function translateScript(src: string, visit: Visit): string {
  return src.replace(LIT, (m, s1, s2, s3) => {
    const body = s1 ?? s2 ?? s3 ?? '';
    const q = m[0];
    if (!hasWords(body) || !/[\s.,!?:]/.test(body.trim()) && !/^[A-Z]/.test(body) && !/^\/[a-z]+$/.test(body)) return m;
    const tr = visit({ key: keyOf(body), text: body, kind: 'script' });
    if (!tr) return m;
    const safe = q === '`' ? tr.replace(/(?<!\\)`/g, '\\`') : tr.replace(new RegExp(`(?<!\\\\)${q}`, 'g'), `\\${q}`);
    return q + safe + q;
  });
}

/** Translate a rendered page. `dict` maps segment keys to translations. Missing keys are reported. */
export interface Pattern { re: RegExp; ka: string; ru: string }

export function translateHtml(html: string, lang: Lang, dict: Translations, patterns: Pattern[] = [], missing?: (s: Segment) => void): string {
  return walk(html, (seg) => {
    const id = seg.kind === 'script' ? `s:${seg.key}` : seg.key;
    const tr = dict[id];
    if (typeof tr === 'string') return tr;
    if (seg.kind !== 'script' && lang !== 'en') {
      for (const p of patterns) {
        const m = seg.text.match(p.re);
        // Captured parts (names, numbers) are translated too when the dictionary knows them.
        // `$1*` looks up the alternate form stored under "<capture>*" (e.g. a month in the nominative).
        if (m) return p[lang].replace(/\$(\d)(\*?)/g, (_x, n, star) => {
          const c = m[+n] ?? '';
          return dict[c + star] ?? dict[keyOf(c)] ?? dict[c] ?? c;
        });
      }
      missing?.(seg);
    }
    return undefined;
  }, lang);
}
