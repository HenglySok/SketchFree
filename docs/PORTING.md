# Porting the prototype into src/

Suggested order (each step keeps the app working):

1. Move brush presets + stamp drawing into `src/engine/brush/` (use `smoothing.ts` already provided).
2. Move `History` usage and pixel-patch commands into `src/engine/history/`.
3. Move document/layer model and compositor into `src/engine/compositor/` behind an interface
   (`recompose(doc, opts): void`) so WebGL2 can be swapped in later.
4. Replace full-canvas layers with `TileStore` per layer; patches become per-tile snapshots.
5. Port UI panels to React in `src/features/*`, driven by Zustand stores (`document`, `workspace`, `tool`).
   Keep pointer handling imperative on the canvas element.
6. Replace the prototype's hand-rolled ZIP and autosave with `storage/project-format.ts` and `idb`.
