// Pointer Events -> DrawingInput (spec 6.4).

import type { DrawingInput, PointerKind } from "../types";

export interface PointerLike {
  clientX: number;
  clientY: number;
  pressure: number;
  tiltX?: number;
  tiltY?: number;
  twist?: number;
  timeStamp: number;
  pointerType: string;
}

export function normalizePointer(e: PointerLike, origin: { left: number; top: number }): DrawingInput {
  const kind: PointerKind = e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse";
  return {
    x: e.clientX - origin.left,
    y: e.clientY - origin.top,
    // Mice report 0.5 while pressed; treat as full pressure so mouse strokes are not faint.
    pressure: kind === "pen" ? (e.pressure > 0 ? e.pressure : 0.5) : 1,
    tiltX: e.tiltX ?? 0,
    tiltY: e.tiltY ?? 0,
    twist: e.twist ?? 0,
    time: e.timeStamp,
    pointerType: kind,
  };
}

/** Use coalesced events when the browser provides them, for smoother fast strokes. */
export function samplesOf<T extends { getCoalescedEvents?: () => T[] }>(e: T): T[] {
  const list = e.getCoalescedEvents?.();
  return list && list.length ? list : [e];
}
