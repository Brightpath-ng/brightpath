import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brightpath/ui", "@brightpath/utils", "@brightpath/types"],
};

export default nextConfig;
