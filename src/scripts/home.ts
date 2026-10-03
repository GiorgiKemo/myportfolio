// Home page motion + interactions.
import './chrome';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hardwareWebGL } from './gl-support';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Keep ScrollTrigger in sync with Lenis smooth scrolling.
window.__lenis?.on('scroll', ScrollTrigger.update);

// ---------- intro (normally already started by the inline script in Hero) ----------
root.classList.add('is-loaded');

// ---------- WebGL: hero orb after first paint, lab when it comes near ----------
const idle = (cb: () => void) => {
  const run = () => {
    if (window.__lenis?.isScrolling && Math.abs(window.__lenis.velocity) > 0.1) { setTimeout(() => idle(cb), 150); return; }
    cb();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1200 });
  else setTimeout(run, 300);
};

const heroCanvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
const lab = document.querySelector<HTMLElement>('[data-lab]');
let gpu: boolean | undefined;
const canRender = () => gpu ??= hardwareWebGL();
if (heroCanvas) {
  const load = () => idle(() => {
    if (!canRender()) { lab?.classList.add('no-webgl'); return; }
    import('./hero-gl').then((m) => idle(() => { m.mountHero(heroCanvas); }));
  });
  if (document.readyState === 'complete') load();
  else addEventListener('load', load, { once: true });
}

if (lab) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    idle(() => {
      if (!canRender()) { lab.classList.add('no-webgl'); return; }
      import('./lab-gl').then((m) => idle(() => {
        m.mountLab(lab).catch(() => lab.classList.add('no-webgl'));
      }));
    });
  }, { rootMargin: '600px 0px' });
  io.observe(lab);
}

// ---------- marquees: constant drift, sped up by scroll velocity ----------
document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((mq) => {
  const track = mq.querySelector<HTMLElement>('.mq-track');
  if (!track || reduced) return;
  const dir = mq.classList.contains('mq-rev') ? 1 : -1;
  let x = 0;
  let boost = 0;
  let visible = false;
  let half = 0;
  new ResizeObserver(([entry]) => { half = entry.contentRect.width / 2; }).observe(track);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(mq);
  ScrollTrigger.create({ onUpdate: (self) => { boost = Math.min(12, Math.abs(self.getVelocity()) / 220); } });
  gsap.ticker.add((_t, dtMs) => {
    if (!visible || !half) return;
    boost *= 0.94;
    x += dir * (0.6 + boost) * (dtMs / 16.7);
    if (x <= -half) x += half;
    if (x >= 0 && dir > 0) x -= half;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
});

// ---------- manifesto: words light up as the paragraph scrolls through ----------
document.querySelectorAll<HTMLElement>('[data-scrub-text]').forEach((el) => {
  const text = (el.textContent ?? '').trim();
  const words = text.split(/\s+/);
  el.innerHTML = `<span class="sr-only">${text}</span>` + words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  const spans = [...el.querySelectorAll<HTMLElement>('.w')];
  if (reduced) { spans.forEach((s) => (s.style.opacity = '1')); return; }
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    end: 'bottom 45%',
    scrub: true,
    onUpdate: (self) => {
      const lit = self.progress * spans.length;
      spans.forEach((s, i) => { s.style.opacity = String(Math.max(0.4, Math.min(1, lit - i + 1))); });
    },
  });
});

// ---------- counters ----------
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const to = Number(el.dataset.count);
  if (reduced || !to) return;
  const obj = { v: 0 };
  el.textContent = '0';
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => gsap.to(obj, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(obj.v)); } }),
  });
});

// ---------- selected work: sticky horizontal rail on wide screens ----------
const mm = gsap.matchMedia();
mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const track = document.querySelector<HTMLElement>('[data-rail-track]');
  if (!rail || !track) return;
  const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
  const measure = () => {
    const height = track.offsetHeight;
    rail.style.setProperty('--rail-height', `${height + distance()}px`);
    rail.style.setProperty('--rail-top', `${Math.max(0, (innerHeight - height) / 2)}px`);
  };
  rail.classList.add('is-horizontal');
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: rail,
      start: () => `top ${rail.style.getPropertyValue('--rail-top')}`,
      end: () => `+=${distance()}`,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  return () => {
    tween.scrollTrigger?.kill();
    ScrollTrigger.removeEventListener('refreshInit', measure);
    rail.classList.remove('is-horizontal');
    rail.style.removeProperty('--rail-height');
    rail.style.removeProperty('--rail-top');
  };
});

// ---------- big headings drift slightly for depth ----------
if (!reduced) {
  gsap.utils.toArray<HTMLElement>('.work-title, .caps-head h2, .contact-title').forEach((h) => {
    gsap.fromTo(h, { yPercent: 12 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

// ---------- project index: floating preview follows the pointer ----------
const float = document.querySelector<HTMLElement>('[data-index-float]');
const floatImg = float?.querySelector('img');
if (float && floatImg && finePointer && !reduced) {
  let fx = 0, fy = 0, tx = 0, ty = 0, on = false;
  document.querySelectorAll<HTMLAnchorElement>('[data-index] .row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      floatImg.src = row.dataset.preview ?? '';
      floatImg.style.cssText = row.dataset.previewStyle ?? '';
      float.classList.add('is-on');
      on = true;
    });
    row.addEventListener('pointerleave', () => { float.classList.remove('is-on'); on = false; });
  });
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    if (!on && !float.classList.contains('is-on')) return;
    fx += (tx - fx) * 0.14; fy += (ty - fy) * 0.14;
    const tilt = Math.max(-12, Math.min(12, (tx - fx) * 0.08));
    float.style.transform = `translate3d(${fx + 28}px, ${fy - 110}px, 0) rotate(${tilt}deg)`;
  });
}

// ---------- spotlight cards ----------
document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// ---------- contact form (EmailJS, same account as the previous site) ----------
const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const subject = form.querySelector<HTMLInputElement>('#cf-subject')!;
  const message = form.querySelector<HTMLTextAreaElement>('#cf-message')!;

  document.querySelectorAll<HTMLElement>('[data-offer]').forEach((a) => a.addEventListener('click', () => {
    const offer = a.dataset.offer!;
    subject.value = `Inquiry: ${offer}`;
    message.value = `I'm interested in the ${offer}. Please let me know the next steps.`;
    window.gtag?.('event', 'service_offer_click', { offer, placement: 'services_section' });
  }));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach((f) => {
      const ok = f.checkValidity() && f.value.trim() !== '';
      f.closest('.field')?.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      status.className = 'form-status err';
      status.textContent = 'Please fill in every field with a valid email.';
      return;
    }
    button.disabled = true;
    label.textContent = 'Sending…';
    status.className = 'form-status';
    status.textContent = '';
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || 'service_4nfbd67',
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || 'template_p099j7y',
        { name: data.name, email: data.email, subject: data.subject, message: data.message },
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || '02CPxeXz4EuwYVpqv' },
      );
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Thank you! Your message is on its way. I will get back to you soon.';
      window.gtag?.('event', 'contact_form_submit', { placement: 'home_contact' });
    } catch {
      status.className = 'form-status err';
      status.textContent = 'Something went wrong. Please email contact@giorgi.codes directly.';
    } finally {
      button.disabled = false;
      label.textContent = 'Send message';
    }
  });
}

addEventListener('load', () => ScrollTrigger.refresh());
