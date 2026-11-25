// Framework-independent engine types (spec sections 5-7).

export type PointerKind = "mouse" | "pen" | "touch";

export interface DrawingInput {
  x: number;
  y: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  time: number;
  pointerType: PointerKind;
}

export interface BrushSettings {
  id: string;
  name: string;
  family: string;
  size: number;
  opacity: number;
  spacing: number; // fraction of brush diameter between stamps
  flow: number;
  hardness: number;
  angle: number;
  roundness: number;
  pressureSize: boolean;
  pressureOpacity: boolean;
  tiltEnabled: boolean;
  smoothing: number; // 0 = raw input, 1 = heavy stabilization
  textureId?: string;
}

export type BlendMode =
  | "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light"
  | "darken" | "lighten" | "color-dodge" | "color-burn" | "difference"
  | "exclusion" | "hue" | "saturation" | "color" | "luminosity" | "add" | "subtract";

export type LayerType = "raster" | "background" | "group" | "text" | "mask";

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  parentId?: string;
  children?: Layer[];
  tileIds?: string[];
  clippingMask?: boolean;
}

export interface DrawingDocument {
  id: string;
  name: string;
  width: number;
  height: number;
  dpi: number;
  colorSpace: string;
  backgroundColor: string;
  layers: Layer[];
  activeLayerId: string;
  metadata: { createdAt: number; updatedAt: number; appVersion: string };
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
