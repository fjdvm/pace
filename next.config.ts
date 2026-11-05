import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["web-tree-sitter"],
  experimental: { serverActions: { bodySizeLimit: "21mb" } },
};

export default nextConfig;
