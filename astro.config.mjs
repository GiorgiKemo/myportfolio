import { defineConfig } from 'astro/config';

// Static output. `preserve` keeps the existing guide URLs (/affiliate/*.html) intact.
export default defineConfig({
  site: 'https://giorgi.codes',
  trailingSlash: 'ignore',
  build: { format: 'preserve', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
