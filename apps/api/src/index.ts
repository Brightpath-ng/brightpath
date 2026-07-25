import { config } from "dotenv";
import path from "node:path";
import { createApp } from "./app.js";

// This monorepo keeps a single .env.local at the repo root (matching the committed
// .env.example) rather than duplicating it per app. Plain dotenv only auto-loads
// ./.env relative to cwd, so without this, apps/api would never see it.
config({ path: path.resolve(process.cwd(), "../../.env.local") });

const port = process.env.PORT ?? 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`brightpath api listening on port ${port}`);
});
