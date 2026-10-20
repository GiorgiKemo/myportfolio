// WebGL capability gate shared by the 3D scenes.
// Software rasterisers (SwiftShader, llvmpipe) technically support WebGL but render on the CPU,
// which blocks the main thread and drains batteries. Those visitors get the static fallback.
// Append ?gl=force to the URL to bypass the check (useful for screenshots and testing).
export function hardwareWebGL(): boolean {
  if (new URLSearchParams(location.search).get('gl') === 'force') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

// Drawing-buffer resolution for a canvas of w×h CSS pixels. Retina and 4K/5K desktop displays
// otherwise ask the GPU to shade 6M+ pixels a frame, which made the scenes stutter on Mac minis.
// The pixel budget keeps big canvases near 1080p-equivalent while small ones stay sharp.
export function cappedPixelRatio(w: number, h: number, maxDpr: number, budget = 2_400_000): number {
  const byBudget = Math.sqrt(budget / Math.max(1, w * h));
  return Math.min(devicePixelRatio, Math.max(1, Math.min(maxDpr, byBudget)));
}

// Watches frame times while a scene animates and lowers its resolution scale when the GPU can't
// keep up (sustained < ~50fps), down to `min`. Scenes multiply their pixel ratio by `scale`.
export function frameGovernor(onChange: (scale: number) => void, min = 0.6) {
  // The first frames after (re)starting include shader warm-up and page-load work, so skip them.
  let scale = 1, frames = -30, total = 0;
  return {
    get scale() { return scale; },
    sample(dt: number) {
      if (scale <= min) return;
      frames += 1;
      if (frames <= 0) return;
      total += dt;
      if (frames < 60) return;
      const avg = total / frames;
      frames = 0;
      total = 0;
      if (avg > 1 / 50) {
        scale = Math.max(min, scale * 0.8);
        onChange(scale);
      }
    },
    reset() { frames = -30; total = 0; },
  };
}
