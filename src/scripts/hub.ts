// The Field Guide hub: library search + filters, tool-finder quiz, code copy,
// stat count-up, card spotlights and the lazily started constellation.

declare global {
  interface Window {
    trackAffiliateEvent?: (name: string, params?: Record<string, unknown>) => void;
  }
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- library: search + topic filters + live count ----------
const lib = document.querySelector<HTMLElement>('[data-library]');
if (lib) {
  const cards = [...lib.querySelectorAll<HTMLElement>('.gcard')];
  const input = lib.querySelector<HTMLInputElement>('input[type=search]');
  const buttons = [...lib.querySelectorAll<HTMLButtonElement>('.filter')];
  const count = lib.querySelector<HTMLElement>('.count');
  const empty = lib.querySelector<HTMLElement>('.empty');
  let active = 'all';
  const apply = () => {
    const q = (input?.value || '').trim().toLowerCase();
    let n = 0;
    cards.forEach((c) => {
      const inCat = active === 'all' || (c.dataset.cat || '').split(' ').includes(active);
      const inText = !q || (c.textContent || '').toLowerCase().includes(q);
      c.hidden = !(inCat && inText);
      if (!c.hidden) n += 1;
    });
    if (count) count.textContent = `${n} ${n === 1 ? 'guide' : 'guides'}`;
    if (empty) empty.hidden = n !== 0;
  };
  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      active = b.dataset.filter || 'all';
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
      window.dispatchEvent(new CustomEvent('fg:topic', { detail: active }));
    });
    b.addEventListener('pointerenter', () => window.dispatchEvent(new CustomEvent('fg:topic', { detail: b.dataset.filter })));
    b.addEventListener('pointerleave', () => window.dispatchEvent(new CustomEvent('fg:topic', { detail: active })));
  });
  input?.addEventListener('input', apply);
  // "/" focuses search (unless typing somewhere already)
  addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.key === '/' && input && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
      e.preventDefault();
      input.focus();
    }
  });
  apply();
}

// ---------- tool finder quiz ----------
const quiz = document.querySelector<HTMLElement>('[data-quiz]');
if (quiz) {
  const steps = [...quiz.querySelectorAll<HTMLElement>('[data-step]')];
  const bar = quiz.querySelector<HTMLElement>('.quiz-progress span');
  const label = quiz.querySelector<HTMLElement>('[data-step-label]');
  const back = quiz.querySelector<HTMLButtonElement>('[data-back]');
  const restart = quiz.querySelector<HTMLButtonElement>('[data-restart]');
  const results = [...quiz.querySelectorAll<HTMLElement>('[data-result]')];
  const answers: Record<string, string> = {};
  let i = 0;
  const setBar = (pct: number, text: string) => {
    if (bar) bar.style.transform = `scaleX(${pct})`;
    if (label) label.textContent = text;
  };
  const show = () => {
    steps.forEach((s, k) => { s.hidden = k !== i; });
    results.forEach((r) => { r.hidden = true; });
    setBar(i / steps.length, `${String(i + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`);
    if (back) back.hidden = i === 0;
    if (restart) restart.hidden = true;
    quiz.classList.remove('is-done');
  };
  const finish = () => {
    steps.forEach((s) => { s.hidden = true; });
    const key = answers.goal === 'site' ? (answers.need || 'host') : answers.goal;
    const hit = results.find((r) => r.dataset.result === key) || results[0];
    hit.hidden = false;
    setBar(1, 'Result');
    if (back) back.hidden = true;
    if (restart) restart.hidden = false;
    quiz.classList.add('is-done');
    window.trackAffiliateEvent?.('tool_finder_result', { result: hit.dataset.result });
    hit.querySelector<HTMLElement>('h4')?.focus({ preventScroll: true });
  };
  quiz.addEventListener('click', (e) => {
    const opt = (e.target as HTMLElement).closest<HTMLButtonElement>('.opt');
    if (!opt) return;
    const step = opt.closest<HTMLElement>('[data-step]');
    if (!step) return;
    step.querySelectorAll('.opt').forEach((o) => o.setAttribute('aria-pressed', String(o === opt)));
    answers[step.dataset.step || ''] = opt.dataset.value || '';
    // Only the website path has a follow-up question
    const next = opt.dataset.next;
    setTimeout(() => {
      if (next) {
        i = steps.findIndex((s) => s.dataset.step === next);
        show();
        steps[i].querySelector<HTMLElement>('.opt')?.focus();
      } else finish();
    }, reduced ? 0 : 260);
  });
  back?.addEventListener('click', () => { i = 0; show(); steps[0].querySelector<HTMLElement>('.opt')?.focus(); });
  restart?.addEventListener('click', () => {
    i = 0;
    quiz.querySelectorAll('.opt').forEach((o) => o.setAttribute('aria-pressed', 'false'));
    show();
    steps[0].querySelector<HTMLElement>('.opt')?.focus();
  });
  show();
}

// ---------- discount code copy ----------
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const state = btn.querySelector<HTMLElement>('[data-copy-state]');
  btn.addEventListener('click', async () => {
    const code = btn.dataset.copy || '';
    try { await navigator.clipboard.writeText(code); if (state) state.textContent = 'Copied ✓'; }
    catch { if (state) state.textContent = 'Select & copy'; }
    window.trackAffiliateEvent?.('affiliate_code_copy', { affiliate_program: 'onehomeschool', placement: 'hub_card' });
    setTimeout(() => { if (state) state.textContent = 'Copy'; }, 2200);
  });
});

// ---------- stat count-up ----------
const stats = [...document.querySelectorAll<HTMLElement>('[data-count]')];
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target as HTMLElement;
    const to = Number(el.dataset.count) || 0;
    if (!to) return;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  stats.forEach((s) => io.observe(s));
}

// ---------- pointer spotlight on cards ----------
if (finePointer) {
  document.querySelectorAll<HTMLElement>('[data-spot], .gcard').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// ---------- constellation: start only when near the viewport ----------
const orb = document.querySelector<HTMLElement>('[data-constellation]');
if (orb) {
  const start = () => import('./hub-constellation').then((m) => m.mount(orb)).catch(() => orb.classList.add('is-static'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: '200px' });
    io.observe(orb);
  } else start();
}

export {};
