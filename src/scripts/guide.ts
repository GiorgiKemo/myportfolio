// Field Guide article behaviour: TOC + scroll-spy, reading progress, tickable
// checklists (progress kept in localStorage), segmented controls, range fills,
// the mobile sticky partner CTA and the `fgBump` helper used by calculators.

declare global {
  interface Window {
    fgBump?: (el: Element | null) => void;
    trackAffiliateEvent?: (name: string, params?: Record<string, unknown>) => void;
  }
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sheet = document.querySelector<HTMLElement>('.g-sheet');
const body = sheet?.querySelector<HTMLElement>('.g-body');

// ---------- helper for calculators ----------
window.fgBump = (el) => {
  if (!el || reduced) return;
  el.classList.remove('bump');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('bump');
};

// ---------- segmented controls: aria-pressed + `change` on the group ----------
document.querySelectorAll<HTMLElement>('.seg').forEach((seg) => {
  seg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b || !seg.contains(b)) return;
    seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    seg.dataset.value = b.dataset.value;
    seg.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

// ---------- range inputs: paint the filled part of the track ----------
const paintRange = (r: HTMLInputElement) => {
  const min = Number(r.min || 0), max = Number(r.max || 100);
  const pct = max > min ? ((Number(r.value) - min) / (max - min)) * 100 : 0;
  r.style.setProperty('--fill', `${pct}%`);
};
document.querySelectorAll<HTMLInputElement>('.g-body input[type="range"]').forEach((r) => {
  paintRange(r);
  r.addEventListener('input', () => paintRange(r));
});

// ---------- table of contents ----------
const tocLists = [...document.querySelectorAll<HTMLOListElement>('[data-toc]')];
let heads: HTMLElement[] = [];
if (body) {
  const skip = '.check, .item, .step, .verdict, .form-card, .result-card, .details, .cta, .more, .card, .path, .decision article';
  heads = [...body.querySelectorAll<HTMLElement>('h2')].filter((h) => !h.closest(skip));
  // Pure checklists have no section headings: list the checklist items instead.
  if (heads.length < 2) {
    const extra = [...body.querySelectorAll<HTMLElement>(':is(.check, .item, .step) > :is(h2, h3)')];
    heads = [...heads, ...extra].sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  }
  const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const used = new Set([...document.querySelectorAll('[id]')].map((el) => el.id));
  heads.forEach((h, i) => {
    if (h.id) return;
    let id = slug(h.textContent || '') || `section-${i + 1}`;
    while (used.has(id)) id += '-x';
    used.add(id);
    h.id = id;
  });
  heads.forEach((h, i) => {
    const label = (h.textContent || '').replace(/\s+/g, ' ').trim();
    tocLists.forEach((ol) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.innerHTML = `<span class="mono">${String(i + 1).padStart(2, '0')}</span>`;
      a.append(document.createTextNode(label));
      li.append(a);
      ol.append(li);
    });
  });
}
if (!heads.length) {
  document.querySelector('[data-toc-card]')?.remove();
  document.querySelector('[data-mtoc]')?.remove();
} else {
  // Close the mobile TOC after a jump.
  const mtoc = document.querySelector<HTMLDetailsElement>('[data-mtoc]');
  mtoc?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) mtoc.open = false; });

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a')];
    const setOn = (id: string) => links.forEach((l) => {
      const on = l.getAttribute('href') === `#${id}`;
      l.classList.toggle('on', on);
      if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
    });
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) setOn((e.target as HTMLElement).id);
    }), { rootMargin: '-18% 0px -72% 0px' });
    heads.forEach((h) => spy.observe(h));
  }
}

// ---------- checklist ticks + progress meter ----------
const items = body
  ? [...body.querySelectorAll<HTMLElement>('.check, .item, .step')].filter((el) => !el.closest('ol.steps'))
  : [];
const meter = document.querySelector<HTMLElement>('[data-meter]');
const meterText = document.querySelector<HTMLElement>('[data-meter-text]');
const meterSegs = document.querySelector<HTMLElement>('[data-meter-segs]');
const meterMini = document.querySelector<HTMLElement>('[data-meter-mini]');
if (items.length) {
  const key = `fg-done:${location.pathname}`;
  let done: number[] = [];
  try { done = JSON.parse(localStorage.getItem(key) || '[]'); } catch { done = []; }
  if (meter) meter.hidden = false;
  const segs = items.map(() => {
    const s = document.createElement('i');
    meterSegs?.append(s);
    return s;
  });
  const paint = () => {
    const flags = items.map((el) => el.classList.contains('is-done'));
    const n = flags.filter(Boolean).length;
    segs.forEach((s, i) => s.classList.toggle('on', flags[i]));
    if (meterText) meterText.textContent = `${n} of ${items.length} checked`;
    if (meterMini) meterMini.textContent = `${n}/${items.length} checked`;
    meter?.classList.toggle('is-complete', n === items.length);
  };
  items.forEach((el, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tick';
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    const label = (el.querySelector('h2, h3')?.textContent || `item ${i + 1}`).trim();
    b.setAttribute('aria-label', `Mark "${label}" as done`);
    if (done.includes(i)) el.classList.add('is-done');
    b.setAttribute('aria-pressed', String(el.classList.contains('is-done')));
    b.addEventListener('click', () => {
      el.classList.toggle('is-done');
      b.setAttribute('aria-pressed', String(el.classList.contains('is-done')));
      const now = items.map((x, k) => (x.classList.contains('is-done') ? k : -1)).filter((k) => k >= 0);
      try { localStorage.setItem(key, JSON.stringify(now)); } catch { /* storage unavailable */ }
      paint();
    });
    el.classList.add('is-tickable');
    el.append(b);
  });
  paint();
}

// ---------- reading progress ----------
const readBar = document.querySelector<HTMLElement>('[data-read-bar]');
const readFill = document.querySelector<HTMLElement>('[data-read-fill]');
const readPct = document.querySelector<HTMLElement>('[data-read-pct]');
let ticking = false;
const onScroll = () => {
  ticking = false;
  let pct = 0;
  if (sheet) {
    const r = sheet.getBoundingClientRect();
    const span = r.height - innerHeight * 0.6;
    pct = span > 0 ? Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / span)) : 0;
  }
  const p = Math.round(pct * 100);
  if (readBar) readBar.style.transform = `scaleX(${pct})`;
  if (readFill) readFill.style.transform = `scaleX(${pct})`;
  if (readPct) readPct.textContent = `${p}%`;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();

// ---------- mobile sticky CTA: after the hero, hidden over the footer ----------
const sticky = document.querySelector<HTMLElement>('[data-sticky]');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const footer = document.querySelector<HTMLElement>('footer');
if (sticky && hero && 'IntersectionObserver' in window) {
  let pastHero = false, atFooter = false;
  const sync = () => sticky.classList.toggle('is-on', pastHero && !atFooter);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
  if (footer) new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; sync(); }).observe(footer);
}

export {};
