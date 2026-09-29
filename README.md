# giorgi.codes

Portfolio and resource guides of Giorgi Kemoklidze, full-stack developer.

## Stack

- [Astro](https://astro.build) static site generation: every page ships as pre-rendered HTML for speed and SEO
- [three.js](https://threejs.org) with custom GLSL shaders for the hero orb and the interactive 3D lab
- [GSAP](https://gsap.com) ScrollTrigger and [Lenis](https://lenis.darkroom.engineering) for scroll-driven motion
- Native cross-document View Transitions between pages
- Self-hosted Geist, Geist Mono and Instrument Serif fonts

## Structure

- `src/pages/index.astro` home page, sections in `src/components/home/`
- `src/pages/work/` project index and one case-study page per project
- `src/pages/affiliate/` The Field Guide hub and guides (URLs unchanged from the previous site)
- `src/data/portfolioData.js` projects and skills (tested by `npm test`)
- `scripts/optimize-previews.mjs` generates the WebP project screenshots

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # data checks
npm run build    # static output in dist/
```

Pushing to `main` deploys `dist/` to GitHub Pages (giorgi.codes).
