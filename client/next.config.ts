import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  server: {
    port: parseInt(process.env.CLIENT_PORT || '3000', 10),
  },
};

export default nextConfig;
