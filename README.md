# SketchStudio Web (working name)

Local-first, Sketchbook-inspired drawing studio for the browser. Original code, UI and branding.

## Two ways to run it

**1. Prototype (no install needed).** Open `prototype/index.html` in a browser. It is one self-contained file
with the full workspace: brushes, eraser, color editor, layers + blend modes, selection, fill, symmetry,
zoom/pan/rotate, brush and color pucks, autosave, `.sweb` save/open, PNG/JPEG export.

**2. Next.js project (foundation).**

```bash
npm install
npm run dev        # http://localhost:3000/studio  (full workspace UI)
npm test           # Vitest unit tests for history, tiles, smoothing
npm run typecheck
```

> The foundation was scaffolded in an environment without network access, so `npm install`,
> `tsc` and `vitest` have **not been run yet**. Run them first and fix anything that surfaces.

## Layout

See `docs/ARCHITECTURE.md`. The `src/engine/*` modules are framework-independent and unit-testable
without React. `prototype/index.html` is the reference behaviour to port into `src/features/*`
(see `docs/PORTING.md`).

## Status vs. the spec

| Area | Prototype | Foundation (TS) |
| --- | --- | --- |
| Brushes, eraser, pressure, smoothing | Yes | Smoothing + stamping modules |
| Undo/redo | Pixel-patch commands | `History` with memory budget |
| Layers, blend modes (16 of 18) | Yes (flat list) | Types only |
| Selection (rect/ellipse/lasso), fill | Yes | - |
| Symmetry (V/H/4-way/radial) | Yes | - |
| Zoom/pan/rotate, touch gestures | Yes | - |
| Autosave (IndexedDB), `.sweb` | Yes (full-layer PNG) | Format + schema + migrations |
| Tiles | No (full-canvas layers) | `TileStore` + LRU |
| Groups, masks, text, guides, gradients, PSD/TIFF, animation, WebGL2 | Not yet | Not yet |

> `/studio` embeds `public/studio/index.html`, a copy of `prototype/index.html`. Edit one, copy to the other, until the UI is ported to React.
