import { Box3, PerspectiveCamera, Vector3 } from 'three';

// Fit the original model's eight corners, including its podium, at any aspect ratio.
export function fitResidence(camera: PerspectiveCamera, bounds: Box3, direction: Vector3) {
  const target = bounds.getCenter(new Vector3());
  const forward = direction.clone().normalize();
  camera.position.copy(target).add(forward);
  camera.lookAt(target);
  const inverse = camera.quaternion.clone().invert();
  const tangent = Math.tan(camera.fov * Math.PI / 360) * 0.82;
  let distance = 0;
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const corner = new Vector3(x, y, z).sub(target).applyQuaternion(inverse);
        distance = Math.max(distance, corner.z + Math.abs(corner.y) / tangent,
          corner.z + Math.abs(corner.x) / (tangent * camera.aspect));
      }
    }
  }
  camera.position.copy(target).addScaledVector(forward, distance);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return { target, distance };
}
