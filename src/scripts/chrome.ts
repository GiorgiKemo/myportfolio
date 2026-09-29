// Site-wide chrome: smooth scroll, header, theme, menu, clock, cursor, reveals.
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
    gtag?: (...args: unknown[]) => void;
  }
}

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- smooth scroll ----------
if (!reduced) {
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 }, autoRaf: true });
  window.__lenis = lenis;
}

// ---------- header: solid after scrolling, hides on the way down ----------
const header = document.querySelector<HTMLElement>('[data-header]');
let lastY = scrollY;
const onScroll = () => {
  const y = scrollY;
  header?.classList.toggle('is-solid', y > 24);
  const menuOpen = header?.querySelector('[data-menu]')?.classList.contains('is-open');
  header?.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 4);
  if (y < lastY - 4 || y < 400) header?.classList.remove('is-hidden');
  lastY = y;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- theme ----------
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('gk-theme', next); } catch { /* storage unavailable */ }
      window.dispatchEvent(new CustomEvent('gk:theme', { detail: next }));
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !reduced) doc.startViewTransition(apply);
    else apply();
  });
});

// ---------- mobile menu ----------
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const setMenu = (open: boolean) => {
  if (!menuBtn || !menu) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    window.__lenis?.stop();
  } else {
    menu.classList.remove('is-open');
    window.__lenis?.start();
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 800);
  }
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Tbilisi clock ----------
const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' });
  const tick = () => clocks.forEach((c) => { c.textContent = fmt.format(new Date()); });
  tick();
  setInterval(tick, 15000);
}

// ---------- analytics hooks kept from the previous site ----------
document.addEventListener('click', (e) => {
  const hub = (e.target as HTMLElement).closest<HTMLElement>('[data-hub-placement]');
  if (hub?.dataset.hubPlacement) {
    window.gtag?.('event', 'affiliate_hub_click', { placement: hub.dataset.hubPlacement, destination: '/affiliate/' });
  }
});

// ---------- reveal on scroll ----------
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  reveals.forEach((el) => io.observe(el));
}

// ---------- custom cursor + magnetic elements (fine pointers only) ----------
if (finePointer && !reduced) {
  const cursor = document.querySelector<HTMLElement>('.cursor');
  const ring = cursor?.querySelector<HTMLElement>('.cursor-ring');
  const dot = cursor?.querySelector<HTMLElement>('.cursor-dot');
  const label = ring?.querySelector('span');
  if (cursor && ring && dot && label) {
    root.classList.add('has-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>('[data-cursor]');
      const link = t.closest('a, button, [role="button"], input, textarea, label, summary');
      cursor.classList.toggle('is-label', !!labelled);
      cursor.classList.toggle('is-link', !labelled && !!link);
      label.textContent = labelled?.dataset.cursor ?? '';
    });
    document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { cursor.style.opacity = '1'; });
  }

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    el.style.transition = 'transform 0.6s var(--ease)';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
