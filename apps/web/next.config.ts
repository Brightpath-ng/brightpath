import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";

// This monorepo keeps a single .env.local at the repo root (matching the committed
// .env.example) rather than duplicating it per app. Next.js only auto-loads env files
// from its own app directory, so without this, apps/web would never see it.
loadEnvConfig(path.resolve(process.cwd(), "../.."));

const nextConfig: NextConfig = {
  transpilePackages: ["@brightpath/ui", "@brightpath/types", "@brightpath/utils"],
};

export default nextConfig;
