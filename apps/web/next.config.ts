import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brightpath/ui", "@brightpath/types"],
};

export default nextConfig;
