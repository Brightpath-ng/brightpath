import { describe, expect, it, vi } from "vitest";
import { createSeedAdminService, type SeedAdminDeps } from "../seed-admin.js";

function buildDeps(overrides: Partial<SeedAdminDeps> = {}): SeedAdminDeps {
  return {
    findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
    findRoleByName: vi.fn().mockResolvedValue({ id: "role_admin" }),
    upsertUserByClerkId: vi.fn().mockResolvedValue({ id: "db_user_1" }),
    findOrCreateClerkUserByEmail: vi.fn().mockResolvedValue({ id: "clerk_user_1" }),
    setClerkPublicMetadataRole: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("seedAdminService.seedAdmin", () => {
  it("looks up the admin role and creates/reuses the Clerk user by email", async () => {
    const deps = buildDeps();
    const service = createSeedAdminService(deps);

    await service.seedAdmin("admin@example.com", "BrightPath Admin");

    expect(deps.findRoleByName).toHaveBeenCalledWith("admin");
    expect(deps.findOrCreateClerkUserByEmail).toHaveBeenCalledWith(
      "admin@example.com",
      "BrightPath Admin"
    );
  });

  it("upserts the DB user under the default tenant with the admin role", async () => {
    const deps = buildDeps();
    const service = createSeedAdminService(deps);

    await service.seedAdmin("admin@example.com", "BrightPath Admin");

    expect(deps.upsertUserByClerkId).toHaveBeenCalledWith({
      clerkId: "clerk_user_1",
      tenantId: "tenant_1",
      roleId: "role_admin",
      name: "BrightPath Admin",
      email: "admin@example.com",
      phone: null,
    });
  });

  it("sets the Clerk publicMetadata role to admin", async () => {
    const deps = buildDeps();
    const service = createSeedAdminService(deps);

    await service.seedAdmin("admin@example.com", "BrightPath Admin");

    expect(deps.setClerkPublicMetadataRole).toHaveBeenCalledWith("clerk_user_1", "admin");
  });

  it("is idempotent -- reuses whatever Clerk user findOrCreateClerkUserByEmail returns", async () => {
    const deps = buildDeps({
      findOrCreateClerkUserByEmail: vi.fn().mockResolvedValue({ id: "existing_clerk_user" }),
    });
    const service = createSeedAdminService(deps);

    const user = await service.seedAdmin("admin@example.com", "BrightPath Admin");

    expect(deps.upsertUserByClerkId).toHaveBeenCalledWith(
      expect.objectContaining({ clerkId: "existing_clerk_user" })
    );
    expect(user).toEqual({ id: "db_user_1" });
  });
});
