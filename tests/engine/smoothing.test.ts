import { describe, it, expect } from "vitest";
import { StrokeSmoother, stampsAlongSegment } from "@/engine/brush/smoothing";

describe("StrokeSmoother", () => {
  it("passes input through at smoothing 0", () => {
    const s = new StrokeSmoother(0);
    s.push({ x: 0, y: 0, pressure: 1 });
    expect(s.push({ x: 10, y: 5, pressure: 1 })).toMatchObject({ x: 10, y: 5 });
  });
  it("lags behind input when smoothing is high", () => {
    const s = new StrokeSmoother(0.5);
    s.push({ x: 0, y: 0, pressure: 1 });
    expect(s.push({ x: 10, y: 0, pressure: 1 }).x).toBeCloseTo(5);
  });
});

describe("stampsAlongSegment", () => {
  it("places evenly spaced stamps and carries the remainder", () => {
    const a = { x: 0, y: 0, pressure: 1 };
    const b = { x: 10, y: 0, pressure: 1 };
    const r = stampsAlongSegment(a, b, 0, () => 4);
    expect(r.stamps.map((p) => p.x)).toEqual([0, 4, 8]);
    expect(r.carry).toBeCloseTo(2);
  });
});
