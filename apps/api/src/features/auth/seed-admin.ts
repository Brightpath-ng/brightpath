import type { RoleName } from "@brightpath/types";
import type { UpsertUserInput } from "./repository.js";

export interface SeedAdminDeps {
  findDefaultTenant: () => Promise<{ id: string }>;
  findRoleByName: (name: RoleName) => Promise<{ id: string }>;
  upsertUserByClerkId: (input: UpsertUserInput) => Promise<{ id: string }>;
  findOrCreateClerkUserByEmail: (email: string, name: string) => Promise<{ id: string }>;
  setClerkPublicMetadataRole: (clerkId: string, role: RoleName) => Promise<void>;
}

export function createSeedAdminService(deps: SeedAdminDeps) {
  return {
    async seedAdmin(email: string, name: string) {
      const [tenant, role, clerkUser] = await Promise.all([
        deps.findDefaultTenant(),
        deps.findRoleByName("admin"),
        deps.findOrCreateClerkUserByEmail(email, name),
      ]);

      const user = await deps.upsertUserByClerkId({
        clerkId: clerkUser.id,
        tenantId: tenant.id,
        roleId: role.id,
        name,
        email,
        phone: null,
      });

      await deps.setClerkPublicMetadataRole(clerkUser.id, "admin");

      return user;
    },
  };
}
