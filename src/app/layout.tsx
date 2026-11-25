import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "SketchStudio Web" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-studio-bg text-neutral-200">{children}</body>
    </html>
  );
}
