// Tile-based raster storage (spec 6.3): 512x512 RGBA8 tiles, lazily
// allocated, with an LRU memory budget. Pure data; no DOM dependency.

import type { Rect } from "../types";

export const TILE_SIZE = 512;

export interface TileKey {
  tx: number;
  ty: number;
}

export const tileId = (tx: number, ty: number): string => `${tx}_${ty}`;

/** Tile coordinates intersecting a pixel rect, clamped to the document. */
export function tilesForRect(rect: Rect, docW: number, docH: number, size = TILE_SIZE): TileKey[] {
  const x0 = Math.max(0, rect.x);
  const y0 = Math.max(0, rect.y);
  const x1 = Math.min(docW, rect.x + rect.w);
  const y1 = Math.min(docH, rect.y + rect.h);
  if (x1 <= x0 || y1 <= y0) return [];
  const out: TileKey[] = [];
  for (let ty = Math.floor(y0 / size); ty <= Math.floor((y1 - 1) / size); ty++) {
    for (let tx = Math.floor(x0 / size); tx <= Math.floor((x1 - 1) / size); tx++) {
      out.push({ tx, ty });
    }
  }
  return out;
}

export class TileStore {
  private tiles = new Map<string, Uint8ClampedArray>();
  private order: string[] = []; // least recently used first

  constructor(
    readonly width: number,
    readonly height: number,
    private readonly maxBytes = 256 * 1024 * 1024,
    private readonly onEvict?: (id: string, data: Uint8ClampedArray) => void,
  ) {}

  get tileCount(): number {
    return this.tiles.size;
  }
  get bytes(): number {
    return this.tiles.size * TILE_SIZE * TILE_SIZE * 4;
  }

  has(tx: number, ty: number): boolean {
    return this.tiles.has(tileId(tx, ty));
  }

  /** Get a tile, allocating a transparent one on first write. */
  get(tx: number, ty: number, allocate = true): Uint8ClampedArray | undefined {
    const id = tileId(tx, ty);
    let t = this.tiles.get(id);
    if (!t && allocate) {
      t = new Uint8ClampedArray(TILE_SIZE * TILE_SIZE * 4);
      this.tiles.set(id, t);
    }
    if (t) this.touch(id);
    this.evict();
    return t;
  }

  ids(): string[] {
    return [...this.tiles.keys()];
  }

  private touch(id: string): void {
    const i = this.order.indexOf(id);
    if (i >= 0) this.order.splice(i, 1);
    this.order.push(id);
  }

  private evict(): void {
    // Evicted tiles are handed to onEvict (e.g. to spill into IndexedDB).
    while (this.bytes > this.maxBytes && this.order.length > 1) {
      const id = this.order.shift()!;
      const data = this.tiles.get(id)!;
      this.tiles.delete(id);
      this.onEvict?.(id, data);
    }
  }
}
