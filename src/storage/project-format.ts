// Native .sweb project container (spec 7.6): a ZIP with versioned manifest.
// Uses fflate (declared in package.json) and zod for validation.

import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate";
import { z } from "zod";

export const FORMAT_VERSION = 1;

export const ManifestSchema = z.object({
  format: z.literal("sweb"),
  version: z.number().int().min(1),
  app: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const LayerMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["raster", "background", "group", "text", "mask"]).default("raster"),
  visible: z.boolean(),
  locked: z.boolean(),
  opacity: z.number().min(0).max(1),
  blendMode: z.string(),
  parentId: z.string().optional(),
  clippingMask: z.boolean().optional(),
  file: z.string(), // e.g. layers/<id>/layer.png (tile files later)
});

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  dpi: z.number().default(72),
  colorSpace: z.string().default("srgb"),
  activeLayerId: z.string(),
  layers: z.array(LayerMetaSchema),
});

export type SwebManifest = z.infer<typeof ManifestSchema>;
export type SwebDocument = z.infer<typeof DocumentSchema>;

/** Migrations keyed by the version they upgrade FROM. */
export const migrations: Record<number, (doc: unknown) => unknown> = {};

export function migrate(doc: unknown, from: number): unknown {
  let cur = doc;
  for (let v = from; v < FORMAT_VERSION; v++) {
    const step = migrations[v];
    if (!step) throw new Error(`Missing migration from v${v}`);
    cur = step(cur);
  }
  return cur;
}

export function writeProject(
  doc: SwebDocument,
  layerFiles: Record<string, Uint8Array>,
  preview?: Uint8Array,
): Uint8Array {
  const now = Date.now();
  const manifest: SwebManifest = {
    format: "sweb", version: FORMAT_VERSION, app: "SketchStudio Web", createdAt: now, updatedAt: now,
  };
  const files: Record<string, Uint8Array> = {
    "manifest.json": strToU8(JSON.stringify(manifest, null, 2)),
    "document.json": strToU8(JSON.stringify(doc, null, 2)),
    ...layerFiles,
  };
  if (preview) files["thumbnails/preview.png"] = preview;
  return zipSync(files, { level: 0 }); // PNG/tile data is already compressed
}

export function readProject(bytes: Uint8Array): { doc: SwebDocument; files: Record<string, Uint8Array> } {
  const files = unzipSync(bytes);
  const manifestRaw = files["manifest.json"];
  const docRaw = files["document.json"];
  if (!manifestRaw || !docRaw) throw new Error("Not a .sweb project");
  const manifest = ManifestSchema.parse(JSON.parse(strFromU8(manifestRaw)));
  const migrated = migrate(JSON.parse(strFromU8(docRaw)), manifest.version);
  return { doc: DocumentSchema.parse(migrated), files };
}
