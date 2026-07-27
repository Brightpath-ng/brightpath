import { createClerkClient } from "@clerk/backend";
import { createSeedAdminService } from "../features/auth/seed-admin.js";
import * as repository from "../features/auth/repository.js";
import { findClerkUserByEmail, createClerkUser } from "../lib/clerk.js";

// No dotenv loading here -- repository.js imports @brightpath/db, whose own
// index.ts already loads the repo-root .env.local as a side effect (see the
// comment there), which covers CLERK_SECRET_KEY/ADMIN_SEED_EMAIL too since
// dotenv loads the whole file, not just DATABASE_URL.

// Dev-instance only -- admins are never self-serve (blueprint §7.4), and this
// script must never run against production Clerk/DB from a local machine
// (docs/claude/environments.md). Safe to re-run: reuses the Clerk user if the
// email already exists instead of erroring.
async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const name = process.env.ADMIN_SEED_NAME ?? "BrightPath Admin";

  if (!email) {
    throw new Error("ADMIN_SEED_EMAIL must be set (see .env.example) to seed an admin user");
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  const service = createSeedAdminService({
    findDefaultTenant: repository.findDefaultTenant,
    findRoleByName: repository.findRoleByName,
    upsertUserByClerkId: repository.upsertUserByClerkId,
    findOrCreateClerkUserByEmail: async (email, name) => {
      const existing = await findClerkUserByEmail(clerk, email);
      return existing ?? createClerkUser(clerk, { email, firstName: name });
    },
    setClerkPublicMetadataRole: async (clerkId, role) => {
      await clerk.users.updateUserMetadata(clerkId, { publicMetadata: { role } });
    },
  });

  const user = await service.seedAdmin(email, name);
  console.log(`Seeded admin user ${email} (id: ${user.id})`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
