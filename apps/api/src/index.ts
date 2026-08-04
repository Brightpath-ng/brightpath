import { config } from "dotenv";
import path from "node:path";
import { createApp } from "./app.js";

// This monorepo keeps a single .env.local at the repo root (matching the committed
// .env.example) rather than duplicating it per app. Plain dotenv only auto-loads
// ./.env relative to cwd, so without this, apps/api would never see it.
config({ path: path.resolve(process.cwd(), "../../.env.local") });

const port = process.env.PORT ?? 4000;
const app = createApp();

// TEMPORARY diagnostic for the "Can't reach database server at base" P1001
// error in production -- prints only the host:port Prisma will actually try
// to connect to (never the user/password/database name), so we can compare
// what the running process really has against what's set in Render's
// dashboard. Remove once the DATABASE_URL issue is resolved.
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const parsed = new URL(dbUrl);
    console.log(`[diagnostic] DATABASE_URL host:port -> ${parsed.host}`);
  } catch {
    console.log("[diagnostic] DATABASE_URL is set but could not be parsed as a URL");
  }
} else {
  console.log("[diagnostic] DATABASE_URL is not set");
}

app.listen(port, () => {
  console.log(`brightpath api listening on port ${port}`);
});
