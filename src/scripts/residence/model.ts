// Original Meridian residence geometry and finishes from CleanWeb Agency.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { getResidenceFloor, type ResidenceRoom } from "./data";

export const FLOOR_HEIGHT = 3.15;
export const floorElevation = (id: number) => id === 0 ? 0 : 3.8 + (id - 1) * FLOOR_HEIGHT;
type Materials = ReturnType<typeof createResidenceMaterials>;
type Finish = keyof Materials;

export function createResidenceMaterials() {
  const matte = (color: number, roughness = .78) => new THREE.MeshStandardMaterial({ color, roughness });
  const woodCanvas = document.createElement("canvas"); woodCanvas.width = 256; woodCanvas.height = 256;
  const ctx = woodCanvas.getContext("2d")!;
  ctx.fillStyle = "#bd9770"; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 3 ? "#c4a27b" : "#b5926a"; ctx.fillRect(i * 16, 0, 15, 256);
    ctx.fillStyle = "#ad8962"; ctx.fillRect(i * 16, (i * 53) % 230, 16, 1);
    for (let j = 0; j < 3; j++) { ctx.fillStyle = "#b7977130"; ctx.fillRect(i * 16 + j * 5 + 2, 0, 1, 256); }
  }
  const woodTexture = new THREE.CanvasTexture(woodCanvas); woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping; woodTexture.repeat.set(2, 2);
  return {
    stone: matte(0xc7beb0), plaster: matte(0xe9e4d9), trim: matte(0xf5f0e5), paving: matte(0xd4cfc3), grout: matte(0xbab4a6),
    metal: new THREE.MeshStandardMaterial({ color: 0x303b3b, roughness: .4, metalness: .65 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x897258, roughness: .38, metalness: .65 }),
    window: new THREE.MeshStandardMaterial({ color: 0x45616b, roughness: .19, metalness: .42 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xaec8c9, roughness: .1, metalness: .12, transparent: true, opacity: .32, depthWrite: false, side: THREE.DoubleSide }),
    oak: new THREE.MeshStandardMaterial({ color: 0xffffff, map: woodTexture, roughness: .76 }),
    walnut: matte(0x6f5037), fabric: matte(0xc9c3b4), linen: matte(0xf0ece1), sage: matte(0x718275), clay: matte(0xae7357), rug: matte(0xa9a58e),
    dark: matte(0x273234), screen: new THREE.MeshStandardMaterial({ color: 0x162b38, roughness: .12, metalness: .2 }),
    leaf: matte(0x566c41), leafLight: matte(0x718252), soil: matte(0x493e31), trunk: matte(0x756049), lawn: matte(0x8a956f),
    water: new THREE.MeshPhysicalMaterial({ color: 0x408e9c, roughness: .16, metalness: .28, clearcoat: 1 }),
    tile: matte(0xc0cec8), light: new THREE.MeshStandardMaterial({ color: 0xffe8bd, emissive: 0xffd190, emissiveIntensity: .55, roughness: .4 }),
  };
}

// Static primitives are merged by finish inside each selectable floor/room.
// Selection still raycasts the actual geometry while keeping draw calls bounded.
class Builder {
  private batches = new Map<Finish, THREE.BufferGeometry[]>();
  private frame = new THREE.Matrix4();
  constructor(private materials: Materials) {}
  private add(geometry: THREE.BufferGeometry, material: Finish, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));
    geometry.applyMatrix4(this.frame.clone().multiply(matrix));
    if (!this.batches.has(material)) this.batches.set(material, []);
    this.batches.get(material)!.push(geometry);
  }
  box(w: number, h: number, d: number, x: number, y: number, z: number, material: Finish, ry = 0) { this.add(new THREE.BoxGeometry(w, h, d).toNonIndexed(), material, x, y, z, 0, ry); }
  soft(w: number, h: number, d: number, x: number, y: number, z: number, material: Finish, radius = .07) { this.add(new RoundedBoxGeometry(w, h, d, 1, radius), material, x, y, z); }
  cylinder(radius: number, height: number, x: number, y: number, z: number, material: Finish, top = radius) { this.add(new THREE.CylinderGeometry(top, radius, height, 12).toNonIndexed(), material, x, y, z); }
  ball(r: number, x: number, y: number, z: number, material: Finish, sx = 1, sy = 1, sz = 1) {
    const geo = new THREE.IcosahedronGeometry(r, 1); geo.scale(sx, sy, sz); this.add(geo, material, x, y, z);
  }
  withFrame(x: number, y: number, z: number, rotation: number, draw: () => void) {
    const previous = this.frame; const local = new THREE.Matrix4().makeRotationY(rotation); local.setPosition(x, y, z);
    this.frame = previous.clone().multiply(local); draw(); this.frame = previous;
  }
  finish(data: Record<string, unknown> = {}) {
    const group = new THREE.Group(); group.userData = data;
    this.batches.forEach((geometries, key) => {
      // Some Three primitives include a UV attribute and others do not.
      for (const geometry of geometries) if (!geometry.getAttribute("uv")) geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(geometry.getAttribute("position").count * 2), 2));
      const geometry = mergeGeometries(geometries, false)!; geometries.forEach(g => g.dispose());
      const mesh = new THREE.Mesh(geometry, this.materials[key]); mesh.castShadow = key !== "glass"; mesh.receiveShadow = true; mesh.userData = data; group.add(mesh);
    }); return group;
  }
}

function plant(b: Builder, x: number, y: number, z: number, size = 1, tree = false) {
  b.cylinder(.32 * size, .48 * size, x, y + .24 * size, z, "stone", .39 * size);
  b.cylinder(.33 * size, .03, x, y + .49 * size, z, "soil");
  if (tree) {
    b.cylinder(.065 * size, 1.6 * size, x, y + 1.05 * size, z, "trunk", .035 * size);
    b.ball(.64 * size, x, y + 1.85 * size, z, "leaf", 1, 1.25, 1);
    b.ball(.46 * size, x - .35 * size, y + 1.5 * size, z + .15, "leafLight");
    b.ball(.42 * size, x + .3 * size, y + 2.1 * size, z - .12, "leaf");
  } else {
    for (let i = 0; i < 5; i++) { const a = i * 2.4; b.ball(.25 * size, x + Math.cos(a) * .2 * size, y + .8 * size + i * .03, z + Math.sin(a) * .2 * size, i % 2 ? "leaf" : "leafLight", .7, 1.5, .7); }
  }
}
function planter(b: Builder, x: number, y: number, z: number, width: number, depth = .55) {
  b.box(width, .48, depth, x, y + .24, z, "stone"); b.box(width - .1, .035, depth - .1, x, y + .49, z, "soil");
  for (let i = 0; i < Math.floor(width / .4); i++) b.ball(.28, x - width / 2 + .25 + i * .4, y + .62, z, i % 2 ? "leaf" : "leafLight", 1, .8, .9);
}
function chair(b: Builder, x: number, z: number, rotation = 0, material: Finish = "sage") {
  b.withFrame(x, 0, z, rotation, () => {
    b.soft(.52, .12, .52, 0, .51, 0, material); b.soft(.52, .53, .09, 0, .79, -.23, material);
    for (const xx of [-.2, .2]) for (const zz of [-.2, .2]) b.box(.035, .45, .035, xx, .25, zz, "metal");
  });
}
function sofa(b: Builder, x: number, z: number, rotation = 0, width = 2.55, material: Finish = "fabric") {
  b.withFrame(x, 0, z, rotation, () => {
    b.soft(width, .24, .96, 0, .3, 0, material); b.soft(width, .62, .2, 0, .68, -.4, material);
    for (const xx of [-width / 2 + .1, width / 2 - .1]) b.soft(.2, .48, .95, xx, .52, 0, material);
    for (const xx of [-width / 4, width / 4]) { b.soft(width / 2 - .23, .2, .69, xx, .52, .04, "linen"); b.soft(.4, .32, .18, xx, .78, -.24, xx < 0 ? "sage" : "clay"); }
    for (const xx of [-width / 2 + .2, width / 2 - .2]) for (const zz of [-.31, .31]) b.cylinder(.035, .17, xx, .11, zz, "walnut");
  });
}
function table(b: Builder, x: number, z: number, width = 1.5, depth = .85, height = .78) {
  b.soft(width, .1, depth, x, height, z, "oak", .04);
  for (const xx of [-width / 2 + .12, width / 2 - .12]) for (const zz of [-depth / 2 + .12, depth / 2 - .12]) b.box(.065, height - .08, .065, x + xx, (height - .08) / 2, z + zz, "walnut");
}
function bed(b: Builder, x: number, z: number, width = 1.75) {
  b.soft(width + .1, .3, 2.12, x, .25, z, "walnut"); b.soft(width, .26, 2.03, x, .49, z, "linen");
  b.soft(width + .14, 1.07, .13, x, .58, z - 1.04, "fabric"); b.soft(width + .02, .12, 1.44, x, .66, z + .24, "sage");
  for (const xx of width > 1.2 ? [-width / 4, width / 4] : [0]) b.soft(width > 1.2 ? .65 : .62, .13, .42, x + xx, .69, z - .68, "linen");
  b.box(width, .025, .38, x, .73, z + .54, "fabric");
}
function bedside(b: Builder, x: number, z: number) {
  b.box(.5, .48, .44, x, .26, z, "oak"); b.cylinder(.065, .25, x, .63, z, "bronze"); b.cylinder(.16, .18, x, .82, z, "linen", .1);
}
function kitchen(b: Builder, x: number, z: number, width: number) {
  b.box(width, .84, .65, x, .45, z, "walnut"); b.box(width + .04, .07, .71, x, .91, z, "trim");
  for (let i = 0; i < Math.floor(width / .55); i++) { const xx = x - width / 2 + .27 + i * .55; b.box(.51, .69, .025, xx, .48, z + .34, "oak"); b.box(.18, .022, .028, xx, .75, z + .365, "metal"); }
  b.box(.6, .025, .43, x + width * .24, .96, z, "dark");
  for (const xx of [-.15, .15]) for (const zz of [-.1, .1]) b.cylinder(.09, .008, x + width * .24 + xx, .98, z + zz, "metal");
  b.box(.54, .025, .38, x - width * .23, .957, z, "metal"); b.box(.41, .026, .27, x - width * .23, .96, z, "dark");
  b.cylinder(.022, .28, x - width * .23, 1.09, z - .21, "bronze"); b.box(.16, .035, .035, x - width * .23 + .07, 1.23, z - .21, "bronze");
}
function desk(b: Builder, x: number, z: number) {
  table(b, x, z, 1.45, .67); b.box(.62, .38, .035, x, 1.13, z - .15, "dark"); b.box(.55, .31, .02, x, 1.13, z - .125, "screen");
  b.box(.05, .12, .05, x, .9, z - .15, "metal"); b.box(.25, .025, .16, x, .84, z - .12, "metal"); b.box(.46, .035, .15, x, .85, z + .12, "dark"); chair(b, x, z + .67, Math.PI);
}
function bookshelf(b: Builder, x: number, z: number, width: number) {
  b.box(width, 1.65, .12, x, .85, z - .16, "walnut");
  for (const y of [.17, .66, 1.15, 1.66]) {
    b.box(width, .06, .4, x, y, z, "oak");
    if (y < 1.6) for (let i = 0; i < Math.floor(width / .16) - 1; i++) b.box(.09, .25 + (i % 3) * .04, .23, x - width / 2 + .15 + i * .16, y + .19, z, ["linen", "sage", "clay", "fabric"][i % 4] as Finish);
  }
}
function lounger(b: Builder, x: number, z: number) {
  b.box(.7, .18, 1.9, x, .26, z, "walnut"); b.soft(.66, .13, 1.84, x, .41, z, "linen"); b.soft(.65, .28, .43, x, .6, z - .67, "fabric");
  for (const zz of [-.65, .65]) b.box(.6, .22, .06, x, .13, z + zz, "metal");
}
function pergola(b: Builder, x: number, z: number, w: number, d: number, roof = true) {
  for (const xx of [-w / 2, w / 2]) for (const zz of [-d / 2, d / 2]) b.box(.12, 2.55, .12, x + xx, 1.27, z + zz, "walnut");
  if (roof) { for (let i = 0; i <= Math.floor(w / .4); i++) b.box(.075, .18, d + .3, x - w / 2 + i * .4, 2.58, z, "oak"); for (const zz of [-d / 2, d / 2]) b.box(w + .2, .16, .12, x, 2.45, z + zz, "walnut"); }
}

function furnishRoom(b: Builder, room: ResidenceRoom, openRoof: boolean) {
  const { width: w, depth: d, kind } = room;
  b.withFrame(room.x, .22, room.z, 0, () => {
    if (kind === "living") {
      b.box(w * .53, .025, d * .59, -w * .18, .02, .36, "rug");
      sofa(b, -w * .23, -.5, 0, Math.min(2.6, w * .46));
      table(b, -w * .23, .72, 1.05, .64, .37); b.cylinder(.12, .12, -w * .23, .49, .72, "clay");
      b.box(w * .45, .4, .35, -w * .21, .23, d / 2 - .27, "walnut"); b.box(1.38, .8, .055, -w * .21, .9, d / 2 - .23, "screen");
      kitchen(b, w * .26, -d / 2 + .42, w * .38);
      b.box(w * .3, .83, .63, w * .27, .45, -.26, "sage"); b.box(w * .32, .07, .71, w * .27, .9, -.26, "trim");
      for (const xx of [w * .17, w * .36]) { b.cylinder(.19, .09, xx, .69, .5, "oak"); b.cylinder(.035, .65, xx, .33, .5, "metal"); }
      table(b, w * .27, d / 2 - .85, 1.35, .7); chair(b, w * .12, d / 2 - .25, Math.PI); chair(b, w * .41, d / 2 - .25, Math.PI); chair(b, w * .12, d / 2 - 1.42); chair(b, w * .41, d / 2 - 1.42);
      plant(b, -w / 2 + .42, 0, d / 2 - .45, .78, true);
    } else if (kind === "bedroom" || kind === "twin") {
      b.box(w - .4, .02, 2.6, 0, .015, .15, "rug");
      if (kind === "twin") { bed(b, -.62, -.45, .9); bed(b, .62, -.45, .9); } else { bed(b, 0, -.42, Math.min(1.8, w - 1.25)); bedside(b, -w / 2 + .48, -.95); bedside(b, w / 2 - .48, -.95); }
      b.box(w - .35, 1.65, .49, 0, .85, d / 2 - .3, "oak");
      for (let i = 0; i < 4; i++) { const xx = -(w - .35) / 2 + (i + .5) * (w - .35) / 4; b.box((w - .35) / 4 - .025, 1.55, .025, xx, .86, d / 2 - .038, "fabric"); b.box(.025, .3, .025, xx + .15, .85, d / 2 - .015, "bronze"); }
    } else if (kind === "bathroom" && d < 3) {
      b.box(1, .07, 1.03, -w / 2 + .57, .05, -d / 2 + .56, "trim"); b.box(1.02, 1.5, .025, -w / 2 + .57, .81, -d / 2 + 1.09, "glass"); b.box(.025, 1.5, 1.05, -w / 2 + 1.1, .81, -d / 2 + .56, "glass");
      b.cylinder(.022, 1.6, -w / 2 + .23, .87, -d / 2 + .18, "bronze"); b.box(.3, .035, .3, -w / 2 + .32, 1.68, -d / 2 + .25, "bronze");
      b.box(.8, .55, .43, w / 2 - .47, .54, -d / 2 + .3, "walnut"); b.soft(.83, .1, .47, w / 2 - .47, .87, -d / 2 + .3, "linen");
      b.soft(.48, .36, .65, w / 2 - .43, .26, d / 2 - .53, "linen"); b.soft(.48, .08, .62, w / 2 - .43, .47, d / 2 - .53, "trim"); b.box(.44, .59, .13, w / 2 - .43, .37, d / 2 - .22, "linen");
    } else if (kind === "bathroom") {
      b.box(w - .15, .08, 1.36, 0, .045, -d / 2 + .75, "trim");
      b.box(w - .12, 1.63, .025, 0, .86, -d / 2 + 1.43, "glass"); b.box(.04, 1.8, .04, -w / 2 + .25, .94, -d / 2 + .18, "bronze"); b.box(.5, .04, .4, -w / 2 + .43, 1.84, -d / 2 + .3, "bronze");
      b.box(w - .25, .46, .52, 0, .64, d / 2 - .4, "walnut"); b.box(w - .2, .08, .57, 0, .91, d / 2 - .4, "trim"); b.soft(.65, .07, .37, 0, .99, d / 2 - .42, "linen");
      b.soft(.54, .37, .7, w / 2 - .42, .25, .25, "linen"); b.soft(.54, .1, .67, w / 2 - .42, .47, .25, "trim"); b.box(.5, .67, .18, w / 2 - .42, .39, -.11, "linen");
      for (let i = 0; i < 5; i++) b.box(.055, .035, .66, -w / 2 + .12, .55 + i * .14, .35, "bronze");
    } else if (kind === "office" || kind === "cowork") {
      if (kind === "office") { desk(b, 0, -d / 2 + .42); bookshelf(b, 0, d / 2 - .2, w - .25); }
      else { for (const xx of [-2.3, 0, 2.3]) desk(b, xx, -d / 2 + .65); table(b, -.5, 1, 2.6, .9); for (const xx of [-1.3, .3]) { chair(b, xx, 1.7, Math.PI); chair(b, xx, .35); } bookshelf(b, w / 2 - 1.15, d / 2 - .3, 1.9); }
    } else if (kind === "wellness" || kind === "gym") {
      b.box(w - .12, 1.45, .035, 0, .82, -d / 2 + .1, "window");
      const mats = kind === "gym" ? [-2.8, -1.6] : [-.52, .52];
      for (const xx of mats) { b.soft(.65, .03, 1.7, xx, .04, .25, "sage", .025); b.cylinder(.16, .12, xx, .12, 1.18, "clay"); }
      if (kind === "gym") for (const xx of [.7, 2.1]) { b.box(.85, .19, 1.75, xx, .16, -.5, "dark"); b.box(.6, .03, 1.4, xx, .28, -.45, "metal"); for (const dx of [-.34, .34]) b.box(.055, 1.02, .055, xx + dx, .69, -1.2, "metal"); b.box(.82, .26, .25, xx, 1.17, -1.2, "screen"); }
      b.box(w - .2, .56, .38, 0, .3, d / 2 - .28, "oak");
      for (let i = 0; i < Math.floor(w / .45); i++) { b.ball(.12, -w / 2 + .3 + i * .45, .7, d / 2 - .28, "dark"); b.ball(.12, -w / 2 + .48 + i * .45, .7, d / 2 - .28, "dark"); }
    } else if (kind === "lobby") {
      b.soft(2.7, 1.06, .86, -1.6, .55, -.95, "stone"); b.box(2.8, .07, .93, -1.6, 1.11, -.95, "trim"); b.box(.65, .37, .045, -1.65, 1.31, -1.07, "screen");
      b.box(3, .025, 2.2, 1.65, .025, .25, "rug"); sofa(b, 1.65, -.65, 0, 2.4); table(b, 1.65, .7, 1.1, .7, .4); chair(b, 2.6, 1.45, Math.PI); plant(b, -3.1, 0, 1.5, 1, true);
    } else if (kind === "cafe") {
      kitchen(b, 0, -d / 2 + .4, w - .65); b.box(1.1, .42, .42, 1, 1.18, -d / 2 + .42, "metal");
      for (const xx of [-2.3, 0, 2.3]) { b.cylinder(.55, .08, xx, .8, .6, "oak"); b.cylinder(.085, .75, xx, .4, .6, "metal"); chair(b, xx, -.1); chair(b, xx, 1.3, Math.PI); b.cylinder(.1, .15, xx, .92, .6, "clay"); }
    } else if (kind === "pool") {
      b.box(w - 1.6, .45, d - 3.4, -.4, .28, -.4, "trim"); b.box(w - 1.95, .035, d - 3.75, -.4, .53, -.4, "water");
      for (const xx of [-2.2, -.9, .4]) lounger(b, xx, d / 2 - 1.13);
      b.cylinder(.025, 1.9, w / 2 - .42, .95, -d / 2 + .5, "bronze"); b.box(.35, .035, .25, w / 2 - .56, 1.91, -d / 2 + .5, "bronze");
      planter(b, -.4, 0, -d / 2 + .28, w - .6, .45);
    } else if (kind === "terrace") {
      pergola(b, 0, 0, w - .75, d - .6, !openRoof);
      sofa(b, -1.6, -d / 2 + .85, 0, 2.5); sofa(b, 1.5, -d / 2 + .85, 0, 2.5);
      table(b, -1.6, .3, 1.4, .78, .4); table(b, 1.5, .3, 1.4, .78, .4); chair(b, -2.1, 1.4, Math.PI); chair(b, 2.1, 1.4, Math.PI);
    } else if (kind === "garden") {
      planter(b, -w / 2 + .35, 0, 0, .55, d - .3); plant(b, -w / 2 + .9, 0, -1.1, .9, true); plant(b, w / 2 - .6, 0, -1.25, .8, true);
      table(b, .25, 0, 2.25, .85); for (const xx of [-.4, .9]) { chair(b, xx, .72, Math.PI); chair(b, xx, -.72); }
      b.box(w - 2, .15, .5, .1, .5, d / 2 - .3, "oak"); for (const xx of [-1.8, 1.8]) b.box(.15, .4, .4, xx, .23, d / 2 - .3, "stone");
    }
  });
}

export function createExterior(materials: Materials) {
  const root = new THREE.Group();
  const site = new Builder(materials);
  site.soft(25, .35, 19, 0, -.4, 0, "paving", .25); site.box(21, .24, 15, 0, -.13, 0, "stone");
  for (let i = -12; i <= 12; i += 1.5) site.box(.018, .014, 18.6, i, -.215, 0, "grout");
  for (let i = -9; i <= 9; i += 1.5) site.box(24.6, .014, .018, 0, -.213, i, "grout");
  for (const x of [-10.6, 10.6]) for (const z of [-6.6, 6.6]) { site.box(2.2, .13, 3.1, x, -.13, z, "lawn"); plant(site, x, -.09, z, 1.35, true); }
  for (const x of [-6.1, 6.1]) { planter(site, x, -.1, 7.7, 3.8, .7); site.box(2.5, .17, .5, x, .43, 8.6, "oak"); for (const dx of [-1, 1]) site.box(.15, .49, .4, x + dx, .1, 8.6, "stone"); }
  for (let i = 0; i < 3; i++) site.box(4.1, .1, 1.1, 0, -.17 + i * .09, 8.8 - i * .7, "trim");
  root.add(site.finish());
  for (let id = 0; id < 6; id++) {
    const b = new Builder(materials); const y = floorElevation(id); const h = id === 0 ? 3.8 : FLOOR_HEIGHT; const w = id === 5 ? 15.1 : 18; const d = id === 5 ? 9 : 11;
    b.soft(w + 1.2, .26, d + 1.6, 0, .04, .2, "trim", .15);
    b.box(w - .8, h - .3, d - 1.6, 0, h / 2, -.15, "window");
    // A masonry core and piers frame recessed glazing on every elevation.
    for (const x of [-w / 2 + .28, w / 2 - .28]) {
      b.box(.56, .62, d - .8, x, .4, -.12, "stone"); b.box(.56, .43, d - .8, x, h - .34, -.12, "stone");
      for (const z of [-d / 2 + .5, -1.5, 1.1, d / 2 - .65]) b.box(.56, h - .3, .65, x, h / 2, z, "stone");
    }
    b.box(2.1, h - .25, .35, 0, h / 2, -d / 2 + .5, "stone");
    const columns = Math.floor(w / 2.1);
    for (let i = 0; i <= columns; i++) { const x = -w / 2 + .65 + i * (w - 1.3) / columns; for (const z of [-d / 2 + .65, d / 2 - .8]) { b.box(.065, h - .28, .14, x, h / 2, z, "metal"); b.box(.16, h - .28, .2, x + .13, h / 2, z + .12, "bronze"); } }
    for (const x of [-w / 2 + .15, w / 2 - .15]) for (const z of [-2.8, -.2, 2.4]) { b.box(.06, h - .65, 1.95, x, h / 2, z, "window"); for (const dz of [-.94, 0, .94]) b.box(.12, h - .7, .045, x + Math.sign(x) * .045, h / 2, z + dz, "bronze"); b.box(.14, .055, 1.95, x, h * .55, z, "metal"); }
    b.box(w - .8, .17, .45, 0, h - .22, d / 2 - .61, "plaster"); b.box(w - .8, .06, .055, 0, h - .31, d / 2 - .33, "light");
    if (id === 0) {
      b.box(5.3, .18, 3.1, 0, 3, d / 2 + .35, "stone");
      for (const x of [-1.08, 1.08]) { b.box(.065, 2.8, .12, x, 1.45, d / 2 - .2, "bronze"); b.box(.05, .6, .04, x * .15, 1.4, d / 2 - .08, "bronze"); }
      b.box(2.2, .065, .8, 0, .21, d / 2 + .1, "dark");
      for (const x of [-5.7, 5.7]) plant(b, x, .14, d / 2 + .15, .83, true);
    } else {
      for (const z of [d / 2 + .83, -d / 2 - .58]) { b.box(w + .45, .88, .045, 0, .68, z, "glass"); b.box(w + .55, .045, .065, 0, 1.13, z, "bronze"); for (let x = -w / 2; x <= w / 2; x += 2.25) b.box(.035, 1, .055, x, .63, z, "metal"); }
      for (const x of [-w / 2 - .48, w / 2 + .48]) { b.box(.045, .88, d + 1.4, x, .68, .1, "glass"); b.box(.065, .045, d + 1.5, x, 1.13, .1, "bronze"); }
      for (const x of [-w / 2 + 1.1, w / 2 - 1.1]) planter(b, x, .18, d / 2 + .33, 1.6, .55);
      b.withFrame(-4, .16, d / 2 + .22, 0, () => { chair(b, -.65, 0, Math.PI); chair(b, .65, 0, Math.PI); b.cylinder(.29, .06, 0, .58, 0, "oak"); b.cylinder(.04, .54, 0, .28, 0, "metal"); });
    }
    // Thin floor reveals and vertical fins give the facade a legible rhythm.
    b.box(w + .45, .06, d + .7, 0, -.11, .15, "bronze");
    const group = b.finish({ floorId: id }); group.position.y = y; root.add(group);
  }
  const roof = new Builder(materials); roof.soft(19.2, .28, 12.6, 0, .04, .2, "trim", .15);
  for (const z of [-5.7, 6.1]) { roof.box(18.5, .75, .08, 0, .57, z, "glass"); roof.box(18.6, .05, .08, 0, .98, z, "bronze"); }
  for (const x of [-9.25, 9.25]) roof.box(.08, .75, 11.8, x, .57, .2, "glass");
  for (const room of getResidenceFloor(6).rooms) furnishRoom(roof, room, false);
  const roofGroup = roof.finish({ floorId: 6 }); roofGroup.position.y = floorElevation(6); root.add(roofGroup);
  return root;
}

export function createInterior(materials: Materials, id: number) {
  const root = new THREE.Group(); const floor = getResidenceFloor(id); const isRoof = id === 6; const scale = id === 5 ? .84 : 1; const w = 18 * scale, d = 11 * scale;
  const shell = new Builder(materials);
  shell.soft(w + 1.2, .3, d + 1.7, 0, 0, .2, "trim", .12); shell.box(w, .12, d, 0, .13, 0, isRoof ? "paving" : "oak");
  if (!isRoof) {
    // Low section walls expose all rooms, with openings at their entrances.
    for (const x of [-w / 2, w / 2]) shell.box(.18, 1.08, d, x, .7, 0, "plaster");
    shell.box(w, 1.08, .18, 0, .7, -d / 2, "plaster");
    for (const x of [-4.9 * scale, 4.9 * scale]) { shell.box(3.05 * scale, .77, .12, x - 2.15 * scale, .59, -.04, "plaster"); shell.box(3.05 * scale, .77, .12, x + 2.15 * scale, .59, -.04, "plaster"); }
    if (id > 0) { for (const x of [-4 * scale, 4 * scale]) shell.box(.13, .84, 4.9 * scale, x, .63, -2.8 * scale, "plaster"); shell.box(2.65 * scale, .77, .13, 2.65 * scale, .6, -2.68 * scale, "plaster"); }
    for (const x of [-1.1 * scale, 1.1 * scale]) { shell.box(.13, .85, 3.6 * scale, x, .63, -3.05 * scale, "plaster"); shell.box(.13, .85, 2.9 * scale, x, .63, 2.45 * scale, "plaster"); }
    // Central circulation: modeled stair treads, lift car and a clear front entrance.
    shell.box(1.85 * scale, .05, d - .2, 0, .23, 0, "paving");
    for (let i = 0; i < 10; i++) shell.box(.82 * scale, .085 + i * .105, .25 * scale, -.45 * scale, .27 + i * .0525, -3.6 * scale + i * .25 * scale, "stone");
    shell.box(.84 * scale, 1.15, 1.55 * scale, .48 * scale, .81, -3.35 * scale, "metal"); shell.box(.74 * scale, .96, .025, .48 * scale, .78, -2.56 * scale, "window"); shell.box(.015, .96, .035, .48 * scale, .78, -2.535 * scale, "bronze");
    for (const z of [-d / 2 + .12, d / 2 + .1]) { shell.box(w - .5, .55, .035, 0, .54, z, "glass"); for (let x = -w / 2 + .3; x < w / 2; x += 1.7) shell.box(.04, .85, .08, x, .68, z, "metal"); }
    for (const x of [-w / 2 + 1, w / 2 - 1]) planter(shell, x, .16, d / 2 + .68, 1.6, .55);
  }
  for (const z of [-d / 2 - .55, d / 2 + .88]) { shell.box(w + .8, .68, .035, 0, .53, z, "glass"); shell.box(w + .8, .045, .065, 0, .89, z, "bronze"); }
  root.add(shell.finish());
  for (const room of floor.rooms) {
    const b = new Builder(materials); b.box(room.width, .035, room.depth, room.x, .205, room.z, room.kind === "bathroom" ? "tile" : isRoof ? "paving" : "oak");
    furnishRoom(b, room, true); root.add(b.finish({ roomId: room.id, floorId: id }));
  }
  return root;
}

export function disposeResidenceGeometry(root: THREE.Object3D) { root.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); }); }
export function disposeResidenceMaterials(materials: Materials) { Object.values(materials).forEach(material => { material.map?.dispose(); material.dispose(); }); }
