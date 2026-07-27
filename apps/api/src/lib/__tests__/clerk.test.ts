import { describe, expect, it, vi } from "vitest";
import type { ClerkClient } from "@clerk/backend";
import { findClerkUserByEmail, createClerkUser } from "../clerk.js";

function buildClerk(overrides: Partial<ClerkClient["users"]> = {}): ClerkClient {
  return {
    users: {
      getUserList: vi.fn().mockResolvedValue({ data: [], totalCount: 0 }),
      createUser: vi.fn().mockResolvedValue({ id: "clerk_user_1" }),
      ...overrides,
    },
  } as unknown as ClerkClient;
}

describe("findClerkUserByEmail", () => {
  it("returns the first matching user when found", async () => {
    const clerk = buildClerk({
      getUserList: vi.fn().mockResolvedValue({ data: [{ id: "clerk_user_1" }], totalCount: 1 }),
    });

    const user = await findClerkUserByEmail(clerk, "tutor@example.com");

    expect(clerk.users.getUserList).toHaveBeenCalledWith({ emailAddress: ["tutor@example.com"] });
    expect(user).toEqual({ id: "clerk_user_1" });
  });

  it("returns null when no user matches", async () => {
    const clerk = buildClerk();

    const user = await findClerkUserByEmail(clerk, "nobody@example.com");

    expect(user).toBeNull();
  });
});

describe("createClerkUser", () => {
  it("creates a user with skipPasswordRequirement set", async () => {
    const clerk = buildClerk();

    const user = await createClerkUser(clerk, {
      email: "tutor@example.com",
      firstName: "Ngozi",
      lastName: "Adeyemi",
    });

    expect(clerk.users.createUser).toHaveBeenCalledWith({
      emailAddress: ["tutor@example.com"],
      firstName: "Ngozi",
      lastName: "Adeyemi",
      skipPasswordRequirement: true,
    });
    expect(user).toEqual({ id: "clerk_user_1" });
  });
});
