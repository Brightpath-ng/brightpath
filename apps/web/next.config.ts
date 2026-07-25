import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brightpath/ui", "@brightpath/types", "@brightpath/utils"],
};

export default nextConfig;
