// Stroke stabilization and stamp interpolation.

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
}

/** Exponential smoothing. smoothing in [0,1): 0 follows input exactly. */
export class StrokeSmoother {
  private cur: StrokePoint | null = null;

  constructor(private readonly smoothing: number) {}

  reset(): void {
    this.cur = null;
  }

  push(p: StrokePoint): StrokePoint {
    const w = 1 - Math.min(0.95, Math.max(0, this.smoothing));
    if (!this.cur) {
      this.cur = { ...p };
    } else {
      this.cur = {
        x: this.cur.x + (p.x - this.cur.x) * w,
        y: this.cur.y + (p.y - this.cur.y) * w,
        pressure: this.cur.pressure + (p.pressure - this.cur.pressure) * w,
      };
    }
    return { ...this.cur };
  }
}

/**
 * Walk a segment emitting stamp positions every `step(pressure)` pixels.
 * `carry` is the distance remaining until the next stamp; returned so
 * spacing stays continuous across segments.
 */
export function stampsAlongSegment(
  from: StrokePoint,
  to: StrokePoint,
  carry: number,
  step: (pressure: number) => number,
): { stamps: StrokePoint[]; carry: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const stamps: StrokePoint[] = [];
  if (dist === 0) return { stamps, carry };
  let pos = carry;
  while (pos <= dist) {
    const k = pos / dist;
    const pressure = from.pressure + (to.pressure - from.pressure) * k;
    stamps.push({ x: from.x + dx * k, y: from.y + dy * k, pressure });
    pos += Math.max(0.5, step(pressure));
  }
  return { stamps, carry: pos - dist };
}
