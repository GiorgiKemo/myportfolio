// Hero WebGL: an iridescent, noise-displaced orb inside a slow particle field.
// Loaded lazily after first paint; pauses when off-screen or the tab is hidden.
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, IcosahedronGeometry, Mesh,
  PerspectiveCamera, Points, Scene, ShaderMaterial, Vector2, WebGLRenderer,
} from 'three';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const orbVertex = /* glsl */ `
uniform float uTime; uniform float uDistort; uniform float uFreq;
varying vec3 vN; varying vec3 vView; varying float vNoise;
${NOISE}
float field(vec3 p){
  float t = uTime * .2;
  float n = snoise(p * uFreq + vec3(t, t * .8, -t));
  float n2 = snoise(p * uFreq * 2.1 - vec3(t * 1.3));
  return (n * .8 + n2 * .2) * uDistort;
}
vec3 displace(vec3 p){ vec3 n = normalize(p); return n * (length(p) + field(n * 1.45)); }
void main(){
  vec3 n = normalize(position);
  vec3 t = normalize(cross(n, abs(n.y) > .99 ? vec3(1., 0., 0.) : vec3(0., 1., 0.)));
  vec3 b = cross(n, t);
  float e = .012;
  vec3 p0 = displace(position);
  vec3 p1 = displace(position + t * e);
  vec3 p2 = displace(position + b * e);
  vec3 dn = normalize(cross(p1 - p0, p2 - p0));
  vNoise = field(n * 1.45) / max(uDistort, .001);
  vec4 mv = modelViewMatrix * vec4(p0, 1.);
  vN = normalize(normalMatrix * dn);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const orbFragment = /* glsl */ `
uniform float uTime; uniform float uLight;
varying vec3 vN; varying vec3 vView; varying float vNoise;
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vView);
  float ndv = clamp(dot(N, V), 0., 1.);
  float fres = pow(1. - ndv, 2.4);
  // thin-film style iridescence driven by view angle + surface noise
  float phase = fres * 1.1 + vNoise * .22 + uTime * .025;
  vec3 film = .55 + .45 * cos(6.28318 * (phase + vec3(.0, .33, .67)));
  vec3 violet = vec3(.545, .424, 1.); vec3 cyan = vec3(.247, .878, 1.); vec3 lime = vec3(.784, 1., .239);
  vec3 tint = mix(violet, cyan, smoothstep(.15, .65, fres));
  tint = mix(tint, lime, smoothstep(.7, .98, fres) * .7);
  vec3 L = normalize(vec3(-.5, .8, .6));
  vec3 L2 = normalize(vec3(.8, -.3, .4));
  float diff = clamp(dot(N, L), 0., 1.);
  float spec = pow(clamp(dot(reflect(-L, N), V), 0., 1.), 60.);
  float spec2 = pow(clamp(dot(reflect(-L2, N), V), 0., 1.), 24.) * .35;
  vec3 core = mix(vec3(.02, .02, .03), vec3(.9, .89, .86), uLight);
  vec3 col = mix(core, tint * film, .1 + fres * .85);
  col += diff * .05 * (1. - uLight);
  col += (spec + spec2) * vec3(1., .98, .95);
  col += tint * pow(fres, 5.) * .6;
  gl_FragColor = vec4(col, 1.);
}`;

const pointsVertex = /* glsl */ `
uniform float uTime; uniform float uPixel;
attribute float aSeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  p.y += sin(uTime * .15 + aSeed * 6.28) * .18;
  p.x += cos(uTime * .1 + aSeed * 3.14) * .12;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.2 + aSeed * 2.4) * uPixel * (6. / -mv.z);
  vAlpha = .25 + .75 * fract(aSeed * 13.7 + uTime * .05);
}`;

const pointsFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, 0., d) * vAlpha;
  gl_FragColor = vec4(uColor, a * .7);
}`;

export async function mountHero(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the CSS gradient fallback stays
  }
  const dpr = Math.min(devicePixelRatio, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const isLight = () => document.documentElement.dataset.theme === 'light';

  const orbMat = new ShaderMaterial({
    vertexShader: orbVertex,
    fragmentShader: orbFragment,
    uniforms: {
      uTime: { value: 0 },
      uDistort: { value: 0.22 },
      uFreq: { value: 0.75 },
      uLight: { value: isLight() ? 1 : 0 },
    },
  });
  const orb = new Mesh(new IcosahedronGeometry(1.3, small ? 16 : 24), orbMat);
  scene.add(orb);

  // Particle field
  const count = small ? 700 : 1600;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const r = 3 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.6;
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph) - 4;
    seed[i] = Math.random();
  }
  const pGeo = new BufferGeometry();
  pGeo.setAttribute('position', new BufferAttribute(pos, 3));
  pGeo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  const pMat = new ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: isLight() ? undefined : AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: dpr },
      uColor: { value: isLight() ? [0.1, 0.1, 0.12] : [0.95, 0.95, 0.9] },
    },
  });
  const points = new Points(pGeo, pMat);
  scene.add(points);

  const setTheme = () => {
    const light = isLight();
    orbMat.uniforms.uLight.value = light ? 1 : 0;
    pMat.uniforms.uColor.value = light ? [0.1, 0.1, 0.12] : [0.95, 0.95, 0.9];
    pMat.blending = light ? 1 : AdditiveBlending; // NormalBlending = 1
    pMat.needsUpdate = true;
  };
  addEventListener('gk:theme', () => { setTheme(); if (reduced) renderer.render(scene, camera); });

  // Layout: orb sits right of centre on wide screens, centred behind text on mobile
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w / h > 1.1;
    baseX = wide ? 1.55 : 0;
    baseY = wide ? 0.1 : 0.55;
    baseScale = wide ? 1 : 0.8;
  };
  let baseX = 0, baseY = 0, baseScale = 1;
  new ResizeObserver(resize).observe(canvas);
  resize();

  // Pointer + scroll influence
  const target = new Vector2();
  const eased = new Vector2();
  let velocity = 0;
  let lastPointer = new Vector2();
  addEventListener('pointermove', (e) => {
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = -((e.clientY / innerHeight) * 2 - 1);
    velocity = Math.min(1, velocity + Math.hypot(nx - lastPointer.x, ny - lastPointer.y) * 1.8);
    lastPointer.set(nx, ny);
    target.set(nx, ny);
  }, { passive: true });

  let scrollP = 0;
  const onScroll = () => {
    const h = canvas.clientHeight || innerHeight;
    scrollP = Math.min(1, Math.max(0, scrollY / h));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let lastT = performance.now();
  let elapsed = 0;
  let running = false;
  let raf = 0;
  const frame = () => {
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    elapsed += dt;
    const t = elapsed;
    eased.lerp(target, 1 - Math.pow(0.001, dt));
    velocity *= Math.pow(0.12, dt);

    orbMat.uniforms.uTime.value = t;
    pMat.uniforms.uTime.value = t;
    orbMat.uniforms.uDistort.value = 0.2 + velocity * 0.22 + scrollP * 0.35;
    orbMat.uniforms.uFreq.value = 0.75 + scrollP * 0.5;

    orb.rotation.y = t * 0.12 + eased.x * 0.6;
    orb.rotation.x = -eased.y * 0.45 + t * 0.04;
    orb.position.x = baseX + eased.x * 0.18;
    orb.position.y = baseY + eased.y * 0.12 + scrollP * 1.4;
    const s = baseScale * (1 - scrollP * 0.25);
    orb.scale.setScalar(s);

    points.rotation.y = t * 0.015 + eased.x * 0.08;
    points.rotation.x = eased.y * 0.05;
    camera.position.y = -scrollP * 0.6;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  await renderer.compileAsync(scene, camera);

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
  canvas.classList.add('is-ready');
}
