import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@interview-kitchen/types", "@interview-kitchen/ui"],
};

export default nextConfig;
