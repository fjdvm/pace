import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["web-tree-sitter"],
  experimental: { serverActions: { bodySizeLimit: "21mb" } },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/prisma/**",
      "node_modules/@prisma/dev/**",
      "node_modules/@prisma/engines/**",
      "node_modules/@electric-sql/pglite/**",
    ],
  },
};

export default nextConfig;
