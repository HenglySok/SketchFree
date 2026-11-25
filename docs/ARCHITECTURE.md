# Architecture

Follows the blueprint (sections 6-8): React shell, framework-independent engine, local-first storage.

```
Pointer Events -> normalizePointer -> StrokeSmoother -> stampsAlongSegment
   -> rasterize into stroke buffer -> commit to layer (opacity/clip) -> compositor -> display
```

## Decisions

- **Canvas 2D first, WebGL2 later.** The compositor interface (`recompose()` in the prototype) is the seam
  where a WebGL2 implementation will replace Canvas 2D blending; Canvas 2D has no `add`/`subtract` blend modes.
- **Stroke buffer.** Dabs accumulate in a separate buffer and are composited at stroke opacity on commit,
  so overlapping dabs do not stack past the brush opacity. Erasing uses `destination-out`.
- **History = commands.** Pixel operations store before/after patches of the dirty rect only; layer
  operations are closures. A byte budget trims the oldest entries.
- **Storage.** Autosave to IndexedDB; native `.sweb` is a ZIP (`manifest.json`, `document.json`,
  `layers/<id>/layer.png`, `thumbnails/preview.png`). Versioned manifest + migrations table.
- **Tiles.** `TileStore` (512x512 RGBA8, LRU) exists and is tested but is not wired in yet; the prototype
  uses one canvas per layer. Moving layers onto tiles is the main P0 engine task for large documents.

## Not yet implemented

Groups/masks/clipping, text layers, guides and perspective rulers, gradients, transform tools,
PSD/TIFF, flipbook, WebGL2 compositor, workers/OffscreenCanvas, PWA, tilt-aware brushes.
