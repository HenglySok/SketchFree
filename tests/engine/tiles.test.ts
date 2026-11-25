import { describe, it, expect } from "vitest";
import { TileStore, tilesForRect, TILE_SIZE } from "@/engine/tiles/tile-store";

describe("tilesForRect", () => {
  it("returns only tiles the rect touches", () => {
    const t = tilesForRect({ x: 500, y: 10, w: 20, h: 20 }, 4096, 4096);
    expect(t).toEqual([{ tx: 0, ty: 0 }, { tx: 1, ty: 0 }]);
  });
  it("clamps to the document and handles empty rects", () => {
    expect(tilesForRect({ x: -50, y: -50, w: 10, h: 10 }, 100, 100)).toEqual([]);
    expect(tilesForRect({ x: 0, y: 0, w: 99999, h: 1 }, 1024, 1024).length).toBe(2);
  });
});

describe("TileStore", () => {
  it("allocates lazily and evicts least recently used tiles over budget", () => {
    const evicted: string[] = [];
    const tileBytes = TILE_SIZE * TILE_SIZE * 4;
    const store = new TileStore(4096, 4096, tileBytes * 2, (id) => evicted.push(id));
    store.get(0, 0); store.get(1, 0); store.get(0, 0); store.get(2, 0);
    expect(store.tileCount).toBe(2);
    expect(evicted).toEqual(["1_0"]);
  });
});
