import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { fitResidence } from '../scripts/residence/camera-fit.ts';

for (const aspect of [0.6, 1, 1.8]) {
  test(`the full residence fits with breathing room at aspect ${aspect}`, () => {
    const camera = new PerspectiveCamera(38, aspect, 0.1, 200);
    const bounds = new Box3(new Vector3(-12.5, -0.6, -9.5), new Vector3(12.5, 23, 9.5));
    for (const direction of [new Vector3(36, 19, 39), new Vector3(-39, 19, 36)]) {
      const fit = fitResidence(camera, bounds, direction);
      assert.ok(Number.isFinite(fit.distance) && fit.distance > 0);
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            const point = new Vector3(x, y, z).project(camera);
            assert.ok(Math.abs(point.x) <= 0.821 && Math.abs(point.y) <= 0.821);
            assert.ok(point.z > -1 && point.z < 1);
          }
        }
      }
    }
  });
}
