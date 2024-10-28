import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  server: {
    port: process.env.CLIENT_PORT || 3000,
  },
};

export default nextConfig;
