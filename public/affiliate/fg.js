/* The Field Guide v2 — shared interactions */
(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (per-viewer preference)
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const readTheme = () => { try { return localStorage.getItem('fg-theme'); } catch { return null; } };
  const saved = readTheme();
  if (saved) root.dataset.theme = saved;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const paintBtn = () => { if (themeBtn) { themeBtn.textContent = isDark() ? '☀️' : '🌙'; themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme'); } };
  paintBtn();
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('fg-theme', root.dataset.theme); } catch { /* storage unavailable */ }
    paintBtn();
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  // Gentle tilt on partner cards (pointer devices only)
  if (!reduced && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Guide library: search + filters
  const lib = document.querySelector('[data-library]');
  if (lib) {
    const cards = [...lib.querySelectorAll('.gcard')];
    const input = lib.querySelector('input[type=search]');
    const buttons = [...lib.querySelectorAll('.filter')];
    const count = lib.querySelector('.count');
    const empty = lib.querySelector('.empty');
    let active = 'all';
    const apply = () => {
      const q = (input?.value || '').trim().toLowerCase();
      let n = 0;
      cards.forEach((c) => {
        const inCat = active === 'all' || c.dataset.cat.split(' ').includes(active);
        const inText = !q || c.textContent.toLowerCase().includes(q);
        c.hidden = !(inCat && inText);
        if (!c.hidden) n += 1;
      });
      if (count) count.textContent = `${n} ${n === 1 ? 'guide' : 'guides'}`;
      if (empty) empty.hidden = n !== 0;
    };
    buttons.forEach((b) => b.addEventListener('click', () => {
      active = b.dataset.filter;
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    input?.addEventListener('input', apply);
    apply();
  }

  // Tool finder quiz
  const quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    const steps = [...quiz.querySelectorAll('[data-step]')];
    const bar = quiz.querySelector('.quiz-progress span');
    const back = quiz.querySelector('[data-back]');
    const restart = quiz.querySelector('[data-restart]');
    const results = [...quiz.querySelectorAll('[data-result]')];
    const answers = {};
    let i = 0;
    const show = () => {
      steps.forEach((s, k) => { s.hidden = k !== i; });
      results.forEach((r) => { r.hidden = true; });
      if (bar) bar.style.width = `${(i / steps.length) * 100}%`;
      back.hidden = i === 0;
      restart.hidden = true;
    };
    const finish = () => {
      steps.forEach((s) => { s.hidden = true; });
      const key = answers.goal === 'site' ? (answers.need || 'host') : answers.goal;
      const hit = results.find((r) => r.dataset.result === key) || results[0];
      hit.hidden = false;
      if (bar) bar.style.width = '100%';
      back.hidden = true;
      restart.hidden = false;
      window.trackAffiliateEvent?.('tool_finder_result', { result: hit.dataset.result });
      hit.querySelector('h4')?.focus();
    };
    quiz.addEventListener('click', (e) => {
      const opt = e.target.closest('.opt');
      if (!opt) return;
      const step = opt.closest('[data-step]');
      step.querySelectorAll('.opt').forEach((o) => o.setAttribute('aria-pressed', String(o === opt)));
      answers[step.dataset.step] = opt.dataset.value;
      // Only the website path has a follow-up question
      const next = opt.dataset.next;
      setTimeout(() => {
        if (next) { i = steps.findIndex((s) => s.dataset.step === next); show(); steps[i].querySelector('.opt')?.focus(); }
        else finish();
      }, reduced ? 0 : 220);
    });
    back.addEventListener('click', () => { i = 0; show(); });
    restart.addEventListener('click', () => {
      i = 0;
      quiz.querySelectorAll('.opt').forEach((o) => o.setAttribute('aria-pressed', 'false'));
      show();
    });
    show();
  }

  // Segmented controls: aria-pressed toggling, emits change on the group
  document.querySelectorAll('.seg').forEach((seg) => {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      seg.dataset.value = b.dataset.value;
      seg.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Mobile sticky CTA appears after the hero
  const sticky = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.g-hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle('show', !e.isIntersecting)).observe(hero);
  }

  // Small helper for calculators
  window.fgBump = (el) => { if (!el || reduced) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
})();
