import { config } from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// This monorepo keeps a single .env.local at the repo root (matching the committed
// .env.example) rather than duplicating it per package. Plain dotenv only auto-loads
// ./.env relative to cwd, so without this, packages/db would never see it.
config({ path: path.resolve(import.meta.dirname, "../../.env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
