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
