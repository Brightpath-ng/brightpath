import { describe, expect, it, vi } from "vitest";
import type { TutorApplicationInput } from "@brightpath/types";
import { createTutorsService, DuplicateApplicationError, type TutorsServiceDeps } from "../service.js";

function buildInput(overrides: Partial<TutorApplicationInput> = {}): TutorApplicationInput {
  return {
    firstName: "Ngozi",
    lastName: "Adeyemi",
    email: "ngozi@example.com",
    phone: "+2348012345678",
    subjects: ["Mathematics"],
    qualifications: "BSc Mathematics, 5 years tutoring experience",
    ...overrides,
  };
}

function buildDeps(overrides: Partial<TutorsServiceDeps> = {}): TutorsServiceDeps {
  return {
    findUserByEmail: vi.fn().mockResolvedValue(null),
    findClerkUserByEmail: vi.fn().mockResolvedValue(null),
    createClerkUser: vi.fn().mockResolvedValue({ id: "clerk_user_1" }),
    setClerkPublicMetadataRole: vi.fn().mockResolvedValue(undefined),
    findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
    findRoleByName: vi.fn().mockResolvedValue({ id: "role_tutor" }),
    createUserWithTutorProfile: vi
      .fn()
      .mockResolvedValue({ user: { id: "db_user_1" }, tutorProfile: { id: "tutor_profile_1" } }),
    ...overrides,
  };
}

describe("tutorsService.applyAsTutor", () => {
  it("creates the Clerk user with the tutor role and the DB rows together", async () => {
    const deps = buildDeps();
    const service = createTutorsService(deps);

    const result = await service.applyAsTutor(buildInput());

    expect(deps.createClerkUser).toHaveBeenCalledWith({
      email: "ngozi@example.com",
      firstName: "Ngozi",
      lastName: "Adeyemi",
    });
    expect(deps.setClerkPublicMetadataRole).toHaveBeenCalledWith("clerk_user_1", "tutor");
    expect(deps.createUserWithTutorProfile).toHaveBeenCalledWith({
      clerkId: "clerk_user_1",
      tenantId: "tenant_1",
      roleId: "role_tutor",
      name: "Ngozi Adeyemi",
      email: "ngozi@example.com",
      phone: "+2348012345678",
      subjects: ["Mathematics"],
      qualifications: "BSc Mathematics, 5 years tutoring experience",
      bio: null,
    });
    expect(result).toEqual({
      user: { id: "db_user_1" },
      tutorProfile: { id: "tutor_profile_1" },
    });
  });

  it("passes bio through when provided", async () => {
    const deps = buildDeps();
    const service = createTutorsService(deps);

    await service.applyAsTutor(buildInput({ bio: "I love teaching." }));

    expect(deps.createUserWithTutorProfile).toHaveBeenCalledWith(
      expect.objectContaining({ bio: "I love teaching." })
    );
  });

  it("sets the Clerk role before writing to the DB", async () => {
    const deps = buildDeps();
    const calls: string[] = [];
    deps.setClerkPublicMetadataRole = vi.fn().mockImplementation(async () => {
      calls.push("setRole");
    });
    deps.createUserWithTutorProfile = vi.fn().mockImplementation(async () => {
      calls.push("createUser");
      return { user: { id: "db_user_1" }, tutorProfile: { id: "tutor_profile_1" } };
    });
    const service = createTutorsService(deps);

    await service.applyAsTutor(buildInput());

    expect(calls).toEqual(["setRole", "createUser"]);
  });

  it("throws DuplicateApplicationError when a User already exists for the email", async () => {
    const deps = buildDeps({ findUserByEmail: vi.fn().mockResolvedValue({ id: "existing_user" }) });
    const service = createTutorsService(deps);

    await expect(service.applyAsTutor(buildInput())).rejects.toThrow(DuplicateApplicationError);
    expect(deps.createClerkUser).not.toHaveBeenCalled();
  });

  it("throws DuplicateApplicationError when a Clerk user already exists for the email (orphaned from a previous attempt)", async () => {
    const deps = buildDeps({
      findClerkUserByEmail: vi.fn().mockResolvedValue({ id: "existing_clerk_user" }),
    });
    const service = createTutorsService(deps);

    await expect(service.applyAsTutor(buildInput())).rejects.toThrow(DuplicateApplicationError);
    expect(deps.createClerkUser).not.toHaveBeenCalled();
  });
});
