/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workers and OffscreenCanvas need no special config; cross-origin isolation
  // headers (SharedArrayBuffer) can be added later if the tile store needs them.
};

export default nextConfig;
