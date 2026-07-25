import { describe, expect, it, vi } from "vitest";
import { createAuthService, MissingPrimaryEmailError, type AuthServiceDeps } from "../service.js";
import type { ClerkUserCreatedEvent } from "../schema.js";

function buildEvent(overrides: Partial<ClerkUserCreatedEvent["data"]> = {}): ClerkUserCreatedEvent {
  return {
    type: "user.created",
    data: {
      id: "user_123",
      primary_email_address_id: "email_1",
      email_addresses: [{ id: "email_1", email_address: "ngozi@example.com" }],
      first_name: "Ngozi",
      last_name: "Adeyemi",
      phone_numbers: [],
      ...overrides,
    },
  };
}

function buildDeps(overrides: Partial<AuthServiceDeps> = {}): AuthServiceDeps {
  return {
    findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
    findRoleByName: vi.fn().mockResolvedValue({ id: "role_parent" }),
    upsertUserByClerkId: vi.fn().mockResolvedValue({ id: "db_user_1" }),
    setClerkPublicMetadataRole: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("authService.handleUserCreated", () => {
  it("creates the user under the default tenant with the parent role", async () => {
    const deps = buildDeps();
    const service = createAuthService(deps);

    await service.handleUserCreated(buildEvent());

    expect(deps.findRoleByName).toHaveBeenCalledWith("parent");
    expect(deps.upsertUserByClerkId).toHaveBeenCalledWith({
      clerkId: "user_123",
      tenantId: "tenant_1",
      roleId: "role_parent",
      name: "Ngozi Adeyemi",
      email: "ngozi@example.com",
      phone: null,
    });
  });

  it("sets the Clerk publicMetadata role after creating the user", async () => {
    const deps = buildDeps();
    const service = createAuthService(deps);

    await service.handleUserCreated(buildEvent());

    expect(deps.setClerkPublicMetadataRole).toHaveBeenCalledWith("user_123", "parent");
  });

  it("falls back to a generic name when Clerk has no first/last name", async () => {
    const deps = buildDeps();
    const service = createAuthService(deps);

    await service.handleUserCreated(buildEvent({ first_name: null, last_name: null }));

    expect(deps.upsertUserByClerkId).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New user" })
    );
  });

  it("uses the phone number when Clerk provides one", async () => {
    const deps = buildDeps();
    const service = createAuthService(deps);

    await service.handleUserCreated(
      buildEvent({ phone_numbers: [{ phone_number: "+2348012345678" }] })
    );

    expect(deps.upsertUserByClerkId).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "+2348012345678" })
    );
  });

  it("throws MissingPrimaryEmailError when no email matches the primary id", async () => {
    const deps = buildDeps();
    const service = createAuthService(deps);

    await expect(
      service.handleUserCreated(buildEvent({ primary_email_address_id: "does-not-exist" }))
    ).rejects.toThrow(MissingPrimaryEmailError);

    expect(deps.upsertUserByClerkId).not.toHaveBeenCalled();
  });
});
