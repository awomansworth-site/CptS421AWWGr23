import type { NextConfig } from "next";

const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: ["informed-connection-555a5a793a.strapiapp.com"],
  },
};

export default nextConfig;