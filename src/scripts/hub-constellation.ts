// A lightweight pseudo-3D "constellation" of every guide (Canvas 2D, no deps).
// Nodes sit on a sphere grouped by topic; it drifts, tilts toward the pointer,
// can be dragged, highlights the library's active topic, and nodes are clickable.

interface NodeIn { t: string; h: string; c: string; p: number }
interface Node extends NodeIn { x: number; y: number; z: number; sx: number; sy: number; sz: number; r: number }

const TOPIC_VAR: Record<string, string> = {
  web: '--cyan', ai: '--signal', biz: '--amber', creative: '--rose', family: '--violet', career: '--c-career',
};
const ORDER = ['web', 'biz', 'ai', 'creative', 'family', 'career'];

export function mount(root: HTMLElement) {
  const canvas = root.querySelector('canvas');
  const tip = root.querySelector<HTMLElement>('[data-tip]');
  const dataEl = root.querySelector('[data-nodes]');
  if (!canvas || !dataEl) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const raw: NodeIn[] = JSON.parse(dataEl.textContent || '[]');
  const sorted = [...raw].sort((a, b) => ORDER.indexOf(a.c) - ORDER.indexOf(b.c));
  const N = sorted.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: Node[] = sorted.map((n, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    return { ...n, x: Math.cos(th) * rad, y, z: Math.sin(th) * rad, sx: 0, sy: 0, sz: 0, r: n.p >= 0.9 ? 6.5 : 4.4 };
  });
  // Each node links to its two nearest neighbours.
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j }) => { if (!edges.some(([p, q]) => (p === j && q === i))) edges.push([i, j]); });
  });

  let colors: Record<string, string> = {};
  let line = 'rgba(255,255,255,.12)';
  let text = '#fff';
  const readColors = () => {
    const cs = getComputedStyle(root);
    colors = Object.fromEntries(Object.entries(TOPIC_VAR).map(([k, v]) => [k, cs.getPropertyValue(v).trim() || '#c8ff3d']));
    line = cs.getPropertyValue('--line-2').trim() || line;
    text = cs.getPropertyValue('--text').trim() || text;
  };
  readColors();
  addEventListener('gk:theme', () => { readColors(); draw(); });

  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    const r = root.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    draw();
  };

  let rotY = 0.6, rotX = -0.25, tiltX = 0, tiltY = 0, targetTX = 0, targetTY = 0, vel = 0;
  let hover: Node | null = null;
  let focusTopic = 'all';

  const project = () => {
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const ax = rotX + tiltX, cx = Math.cos(ax), sx = Math.sin(ax);
    const R = Math.min(W, H) * 0.4;
    for (const n of nodes) {
      const x1 = n.x * cy + n.z * sy + tiltY * 0.0;
      const z1 = -n.x * sy + n.z * cy;
      const y1 = n.y * cx - z1 * sx;
      const z2 = n.y * sx + z1 * cx;
      const persp = 2.6 / (2.6 - z2);
      n.sx = W / 2 + x1 * R * persp + tiltY * 18;
      n.sy = H / 2 + y1 * R * persp;
      n.sz = z2;
    }
  };

  const alphaFor = (n: Node) => {
    const depth = (n.sz + 1) / 2; // 0 back … 1 front
    const dim = focusTopic !== 'all' && n.c !== focusTopic;
    return (0.25 + depth * 0.75) * (dim ? 0.18 : 1);
  };

  function draw() {
    if (!ctx || !W) return;
    project();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // edges
    ctx.lineWidth = 1;
    for (const [i, j] of edges) {
      const a = nodes[i], b = nodes[j];
      const same = a.c === b.c;
      const al = Math.min(alphaFor(a), alphaFor(b));
      ctx.globalAlpha = al * (same ? 0.75 : 0.35);
      ctx.strokeStyle = same ? colors[a.c] : line;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    }
    // nodes back-to-front
    const order = [...nodes].sort((p, q) => p.sz - q.sz);
    for (const n of order) {
      const al = alphaFor(n);
      const persp = 2.6 / (2.6 - n.sz);
      const r = n.r * persp * (n === hover ? 1.7 : 1);
      ctx.globalAlpha = al;
      if (n.sz > 0.2 || n === hover) {
        const g = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, r * 5);
        g.addColorStop(0, colors[n.c]);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = al * 0.28;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.sx, n.sy, r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = al;
      }
      ctx.fillStyle = colors[n.c];
      ctx.beginPath(); ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2); ctx.fill();
      if (n.p >= 0.9) {
        ctx.strokeStyle = colors[n.c];
        ctx.globalAlpha = al * 0.6;
        ctx.beginPath(); ctx.arc(n.sx, n.sy, r + 4, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (tip) {
      if (hover) {
        tip.hidden = false;
        tip.textContent = hover.t;
        const left = Math.min(Math.max(hover.sx, 90), W - 90);
        tip.style.transform = `translate(${left}px, ${hover.sy - 18}px) translate(-50%, -100%)`;
      } else tip.hidden = true;
    }
  }

  // ---------- interaction ----------
  let dragging = false, lastX = 0;
  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    targetTY = (px / r.width - 0.5) * 1.2;
    targetTX = (py / r.height - 0.5) * 0.6;
    if (dragging) { vel = (e.clientX - lastX) * 0.004; rotY += vel; lastX = e.clientX; }
    let best: Node | null = null, bd = 22 * 22;
    for (const n of nodes) {
      if (n.sz < -0.35) continue;
      const d = (n.sx - px) ** 2 + (n.sy - py) ** 2;
      if (d < bd) { bd = d; best = n; }
    }
    hover = best;
    root.style.cursor = best ? 'pointer' : dragging ? 'grabbing' : 'grab';
    if (reduced) draw();
  });
  root.addEventListener('pointerleave', () => { hover = null; targetTX = 0; targetTY = 0; dragging = false; if (reduced) draw(); });
  root.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; });
  addEventListener('pointerup', () => { dragging = false; });
  root.addEventListener('click', () => { if (hover) location.href = hover.h; });
  addEventListener('fg:topic', (e) => { focusTopic = (e as CustomEvent<string>).detail || 'all'; if (reduced) draw(); });

  // ---------- loop (only while visible) ----------
  let running = false, raf = 0, last = performance.now();
  const tick = (t: number) => {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!dragging) { rotY += dt * 0.16 + vel; vel *= 0.94; }
    tiltX += (targetTX - tiltX) * 0.06;
    tiltY += (targetTY - tiltY) * 0.06;
    draw();
    raf = requestAnimationFrame(tick);
  };
  const setRunning = (on: boolean) => {
    if (reduced || on === running) return;
    running = on;
    if (on) { last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
  };
  new ResizeObserver(resize).observe(root);
  resize();
  root.classList.add('is-live');
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; setRunning(visible && !document.hidden); }).observe(root);
  document.addEventListener('visibilitychange', () => setRunning(visible && !document.hidden));
  setRunning(true);
}
