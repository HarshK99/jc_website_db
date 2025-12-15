import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to support admin dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
