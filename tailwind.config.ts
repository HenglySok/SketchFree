import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: { bg: "#1e1f22", panel: "#2a2b2f", line: "#3d3e45", accent: "#4da3ff" },
      },
    },
  },
  plugins: [],
};

export default config;
