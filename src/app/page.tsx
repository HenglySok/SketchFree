import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">SketchStudio Web</h1>
      <p className="text-neutral-400">Local-first browser drawing studio.</p>
      <Link className="rounded bg-studio-accent px-4 py-2 text-black" href="/studio">
        Open studio
      </Link>
    </main>
  );
}
