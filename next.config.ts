import type { NextConfig } from "next";

// basePath is "/homeroom" only for the GitHub Pages build (set via env at build time);
// empty otherwise, so the app also works at the domain root (e.g. on Vercel).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
