// "The Lab": CleanWeb's original residence and the material playground.
import {
  ACESFilmicToneMapping, Box3, BufferGeometry, Color, DirectionalLight, Group, HemisphereLight, IcosahedronGeometry, Material, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene,
  PCFShadowMap, PlaneGeometry, ShadowMaterial, SphereGeometry, SRGBColorSpace, TorusGeometry, TorusKnotGeometry, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createExterior, createResidenceMaterials, disposeResidenceGeometry, disposeResidenceMaterials } from './residence/model';
import { fitResidence } from './residence/camera-fit';

type FormKey = 'building' | 'knot' | 'torus' | 'gem' | 'sphere';
type MatKey = 'iridescent' | 'glass' | 'chrome' | 'clay' | 'wire';

export async function mountLab(root: HTMLElement) {
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environment = pmrem.fromScene(roomEnvironment, 0.04);
  roomEnvironment.dispose();
  scene.environment = environment.texture;

  const camera = new PerspectiveCamera(38, 1, 0.1, 200);
  camera.position.set(0, 0, 8);

  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const residenceMaterials = createResidenceMaterials();
  const building = createExterior(residenceMaterials);
  scene.add(building);
  const bounds = new Box3().setFromObject(building);
  const buildingLights = new Group();
  buildingLights.add(new HemisphereLight(0xf1f3ed, 0x9b927e, 1.7));
  const sun = new DirectionalLight(0xfff1d8, 2.8);
  sun.position.set(-18, 32, 22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, far: 90 });
  sun.shadow.normalBias = 0.045;
  sun.shadow.bias = -0.0003;
  buildingLights.add(sun);
  const fill = new DirectionalLight(0xdce8ff, 1.1);
  fill.position.set(20, 15, -18);
  buildingLights.add(fill);
  scene.add(buildingLights);
  const ground = new Mesh(new PlaneGeometry(200, 200), new ShadowMaterial({ color: 0x4e5845, opacity: 0.15 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.62;
  ground.receiveShadow = true;
  scene.add(ground);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // The page keeps normal wheel and touch scrolling.
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.09;
  controls.minPolarAngle = 0.04;
  controls.maxPolarAngle = Math.PI / 2 - 0.025;
  canvas.style.touchAction = 'pan-y';
  let fittedDistance = 1;
  const fitBuilding = (reset = false) => {
    const damping = controls.enableDamping;
    if (reset) { controls.enableDamping = false; controls.update(); }
    const zoom = reset ? 1 : controls.getDistance() / fittedDistance;
    const direction = reset ? new Vector3(36, 19, 39) : camera.position.clone().sub(controls.target);
    const fit = fitResidence(camera, bounds, direction);
    fittedDistance = fit.distance;
    controls.target.copy(fit.target);
    controls.minDistance = fittedDistance * 0.65;
    controls.maxDistance = fittedDistance * 1.8;
    camera.position.sub(fit.target).multiplyScalar(reset ? 1 : Math.max(0.65, Math.min(1.8, zoom))).add(fit.target);
    controls.update();
    controls.enableDamping = damping;
  };

  const forms: Record<Exclude<FormKey, 'building'>, () => BufferGeometry> = {
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
  let form: FormKey = 'building';
  let mat: MatKey = 'iridescent';
  const mesh = new Mesh(forms.knot(), materials[mat]());
  mesh.visible = false;
  pivot.add(mesh);

  const stats = root.querySelector<HTMLElement>('[data-lab-stats]');
  const paintStats = () => {
    if (form === 'building') {
      if (stats) stats.textContent = 'Meridian residence · Original CleanWeb concept';
      return;
    }
    const g = mesh.geometry;
    const tris = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
    if (stats) stats.textContent = `${Math.round(tris).toLocaleString('en-US')} tris · ${mat} · ${form}`;
  };
  paintStats();

  const materialControls = root.querySelector<HTMLElement>('[data-lab-material]');
  const cameraControls = root.querySelector<HTMLElement>('[data-lab-camera]');
  const setScene = () => {
    const isBuilding = form === 'building';
    building.visible = buildingLights.visible = ground.visible = isBuilding;
    mesh.visible = key.visible = !isBuilding;
    controls.enabled = isBuilding;
    scene.environmentIntensity = isBuilding ? 0.52 : 1;
    camera.fov = isBuilding ? 38 : 32;
    root.classList.toggle('is-building', isBuilding);
    if (materialControls) materialControls.hidden = isBuilding;
    if (cameraControls) cameraControls.hidden = !isBuilding;
    canvas.setAttribute('aria-label', isBuilding ? 'Interactive Meridian building. Drag to orbit.' : 'Interactive 3D object. Drag to rotate.');
    const hint = root.querySelector<HTMLElement>('.lab-hint');
    if (hint) hint.textContent = isBuilding ? 'Drag to orbit · Arrow keys rotate · + / − zoom' : 'Drag to rotate · Switch the shape and material';
    if (isBuilding) {
      fitBuilding(true);
      renderer.shadowMap.needsUpdate = true;
    } else {
      camera.position.set(0, 0, camera.aspect < 1 ? 10.5 : 8);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  };
  setScene();

  const moveCamera = (action: string) => {
    if (form !== 'building') return;
    if (action === 'reset') fitBuilding(true);
    else if (action === 'left' || action === 'right') controls.rotateLeft(action === 'left' ? Math.PI / 4 : -Math.PI / 4);
    else if (action === 'up' || action === 'down') controls.rotateUp(action === 'up' ? 0.14 : -0.14);
    else if (action === 'in') controls.dollyIn(1 / 1.15);
    else if (action === 'out') controls.dollyOut(1 / 1.15);
    controls.update();
    render();
  };
  cameraControls?.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-camera]');
    if (button) moveCamera(button.dataset.camera!);
  });
  canvas.addEventListener('keydown', (e) => {
    const action = ({ ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' } as Record<string, string>)[e.key];
    if (form !== 'building' || !action) return;
    e.preventDefault();
    moveCamera(action);
  });

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
        if (form !== 'building') mesh.geometry = forms[form]();
        setScene();
        pop = 1;
      } else {
        (mesh.material as Material).dispose();
        mat = v as MatKey;
        mesh.material = materials[mat]();
      }
      paintStats();
      render();
    });
  });

  // Drag to rotate with inertia
  let dragging = false, px = 0, py = 0, vx = 0.004, vy = 0;
  canvas.addEventListener('pointerdown', (e) => { if (form === 'building') return; dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); root.classList.add('is-dragging'); });
  canvas.addEventListener('pointermove', (e) => {
    if (form === 'building' || !dragging) return;
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
    renderer.setPixelRatio(Math.min(devicePixelRatio, w < 480 ? 1.5 : 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (form === 'building') fitBuilding();
    else camera.position.z = w / h < 1 ? 10.5 : 8;
    camera.updateProjectionMatrix();
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let pop = 0;
  let prepared = false;
  const render = () => { if (prepared) renderer.render(scene, camera); };
  controls.addEventListener('change', () => { if (!running) render(); });
  let running = false, raf = 0, last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (form === 'building') {
      if (controls.update(dt)) render();
    } else {
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
    }
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!running && prepared && !reduced && visible && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  let visible = false;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  await renderer.compileAsync(scene, camera);
  prepared = true;
  render();
  start();
  root.classList.add('is-ready');

  document.addEventListener('astro:before-swap', () => {
    stop();
    ro.disconnect();
    io.disconnect();
    controls.dispose();
    disposeResidenceGeometry(building);
    disposeResidenceMaterials(residenceMaterials);
    mesh.geometry.dispose();
    (mesh.material as Material).dispose();
    ground.geometry.dispose();
    ground.material.dispose();
    sun.shadow.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
  }, { once: true });
}
