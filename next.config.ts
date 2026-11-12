import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the Dockerfile runs the self-contained server from .next/standalone
  output: 'standalone',
};

export default nextConfig;
