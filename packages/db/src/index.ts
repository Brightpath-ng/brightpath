import { config } from "dotenv";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client/index.js";

// This monorepo keeps a single .env.local at the repo root (matching the committed
// .env.example) rather than duplicating it per package. Callers that already loaded
// it (e.g. apps/api) are unaffected -- dotenv doesn't override already-set vars --
// but standalone usage (the seed script, `prisma studio`) needs this directly.
config({ path: path.resolve(import.meta.dirname, "../../../.env.local") });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
