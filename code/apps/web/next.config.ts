import type { NextConfig } from "next";

const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: isCI,
  },
  typescript: {
    ignoreBuildErrors: isCI,
  },
  images: {
    // Avoid remote domain config issues in dev/demo
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
