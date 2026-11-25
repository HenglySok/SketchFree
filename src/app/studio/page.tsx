"use client";

/**
 * Hosts the full workspace (menus, pucks, panels, layers, color editor).
 * The workspace currently lives in public/studio/index.html (copied from
 * prototype/index.html). Port it into src/features/* following docs/PORTING.md.
 */
export default function StudioPage() {
  return (
    <iframe
      src="/studio/index.html"
      title="SketchStudio workspace"
      className="h-full w-full border-0"
      allow="fullscreen"
    />
  );
}
