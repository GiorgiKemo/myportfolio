// "The Lab": a physically-based 3D playground. Drag to spin, switch form and material.
import {
  ACESFilmicToneMapping, BufferGeometry, Color, DirectionalLight, Group, IcosahedronGeometry, Material, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene,
  SphereGeometry, SRGBColorSpace, TorusGeometry, TorusKnotGeometry, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type FormKey = 'knot' | 'torus' | 'gem' | 'sphere';
type MatKey = 'iridescent' | 'glass' | 'chrome' | 'clay' | 'wire';

export function mountLab(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    root.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 8);

  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const forms: Record<FormKey, () => BufferGeometry> = {
    knot: () => new TorusKnotGeometry(1.05, 0.34, 360, 48, 2, 3),
    torus: () => new TorusGeometry(1.2, 0.46, 96, 180),
    gem: () => new IcosahedronGeometry(1.5, 0),
    sphere: () => new SphereGeometry(1.45, 128, 96),
  };
  const materials: Record<MatKey, () => Material> = {
    iridescent: () => new MeshPhysicalMaterial({ color: 0x111111, metalness: 1, roughness: 0.18, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [120, 820], clearcoat: 1 }),
    glass: () => new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 1.6, ior: 1.52, dispersion: 4, attenuationColor: new Color('#c8ff3d'), attenuationDistance: 3.5, envMapIntensity: 1.2 }),
    chrome: () => new MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06 }),
    clay: () => new MeshStandardMaterial({ color: 0xc8ff3d, metalness: 0, roughness: 0.85 }),
    wire: () => new MeshBasicMaterial({ color: 0xc8ff3d, wireframe: true, transparent: true, opacity: 0.55 }),
  };

  const pivot = new Group();
  scene.add(pivot);
  let form: FormKey = 'knot';
  let mat: MatKey = 'iridescent';
  const mesh = new Mesh(forms[form](), materials[mat]());
  pivot.add(mesh);

  const stats = root.querySelector<HTMLElement>('[data-lab-stats]');
  const paintStats = () => {
    const g = mesh.geometry;
    const tris = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
    if (stats) stats.textContent = `${Math.round(tris).toLocaleString('en-US')} tris · ${mat} · ${form}`;
  };
  paintStats();

  // Controls: segmented buttons
  root.querySelectorAll<HTMLElement>('[data-lab-group]').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-value]');
      if (!btn) return;
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const v = btn.dataset.value!;
      if (group.dataset.labGroup === 'form') {
        mesh.geometry.dispose();
        form = v as FormKey;
        mesh.geometry = forms[form]();
        pop = 1;
      } else {
        (mesh.material as Material).dispose();
        mat = v as MatKey;
        mesh.material = materials[mat]();
      }
      paintStats();
      if (!running) render();
    });
  });

  // Drag to rotate with inertia
  let dragging = false, px = 0, py = 0, vx = 0.004, vy = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); root.classList.add('is-dragging'); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vx = (e.clientX - px) * 0.006; vy = (e.clientY - py) * 0.006;
    px = e.clientX; py = e.clientY;
    pivot.rotation.y += vx; pivot.rotation.x += vy;
    if (!running) render();
  });
  const end = () => { dragging = false; root.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 10.5 : 8;
    camera.updateProjectionMatrix();
    if (!running) render();
  };
  new ResizeObserver(resize).observe(canvas);

  let pop = 0;
  const render = () => renderer.render(scene, camera);
  let running = false, raf = 0, last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!dragging) {
      vx += (0.004 - vx) * (1 - Math.pow(0.05, dt));
      vy *= Math.pow(0.05, dt);
      pivot.rotation.y += vx;
      pivot.rotation.x += vy;
      pivot.rotation.x *= 1 - dt * 0.6;
    }
    pop *= Math.pow(0.02, dt);
    mesh.scale.setScalar(1 - pop * 0.25);
    mesh.rotation.z += dt * 0.08;
    render();
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!running && !reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  render();
  root.classList.add('is-ready');
}
