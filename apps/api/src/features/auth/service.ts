import type { RoleName } from "@brightpath/types";
import type { ClerkUserCreatedEvent } from "./schema.js";
import type { UpsertUserInput } from "./repository.js";

// Every self-serve sign-up becomes a parent. Tutors go through the recruitment
// flow (blueprint §7.3), admins are created directly -- neither signs up here.
const SELF_SERVE_SIGNUP_ROLE: RoleName = "parent";

export interface AuthServiceDeps {
  findDefaultTenant: () => Promise<{ id: string }>;
  findRoleByName: (name: RoleName) => Promise<{ id: string }>;
  upsertUserByClerkId: (input: UpsertUserInput) => Promise<{ id: string }>;
  setClerkPublicMetadataRole: (clerkId: string, role: RoleName) => Promise<void>;
}

export class MissingPrimaryEmailError extends Error {
  constructor(clerkId: string) {
    super(`Clerk user ${clerkId} has no primary email address`);
    this.name = "MissingPrimaryEmailError";
  }
}

export function createAuthService(deps: AuthServiceDeps) {
  return {
    async handleUserCreated(event: ClerkUserCreatedEvent) {
      const { data } = event;

      // A role already set means the API created this Clerk user directly
      // with a specific role in mind (tutor applications, admin seeding via
      // seed-admin.ts) -- not a genuine self-serve sign-up. Without this
      // check, this webhook (async, arrives moments after creation) would
      // silently overwrite that role back to "parent" below.
      if (data.public_metadata?.role) {
        return;
      }

      const primaryEmail = data.email_addresses.find(
        (address) => address.id === data.primary_email_address_id
      );
      if (!primaryEmail) {
        throw new MissingPrimaryEmailError(data.id);
      }

      const [tenant, role] = await Promise.all([
        deps.findDefaultTenant(),
        deps.findRoleByName(SELF_SERVE_SIGNUP_ROLE),
      ]);

      const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "New user";

      const user = await deps.upsertUserByClerkId({
        clerkId: data.id,
        tenantId: tenant.id,
        roleId: role.id,
        name,
        email: primaryEmail.email_address,
        phone: data.phone_numbers[0]?.phone_number ?? null,
      });

      await deps.setClerkPublicMetadataRole(data.id, SELF_SERVE_SIGNUP_ROLE);

      return user;
    },
  };
}
