import { describe, expect, it, vi } from "vitest";
import type { TutorProfile } from "@brightpath/db";
import type { TutorApplicationInput } from "@brightpath/types";
import {
  createTutorsService,
  DuplicateApplicationError,
  TutorProfileNotFoundError,
  ApplicationAlreadyDecidedError,
  type TutorsServiceDeps,
} from "../service.js";

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

function buildProfile(overrides: Partial<TutorProfile> = {}): TutorProfile {
  return {
    id: "tutor_profile_1",
    userId: "db_user_1",
    subjects: ["Mathematics"],
    qualifications: "BSc Mathematics, 5 years tutoring experience",
    bio: null,
    status: "PENDING",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
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
    findTutorProfileByClerkId: vi.fn().mockResolvedValue(buildProfile()),
    findTutorProfileById: vi.fn().mockResolvedValue(buildProfile()),
    listPendingTutorProfiles: vi.fn().mockResolvedValue([]),
    updateTutorProfileStatus: vi.fn().mockResolvedValue(buildProfile({ status: "APPROVED" })),
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

describe("tutorsService.getMyProfile", () => {
  it("returns the profile for the caller's Clerk id", async () => {
    const deps = buildDeps();
    const service = createTutorsService(deps);

    const profile = await service.getMyProfile("clerk_user_1");

    expect(deps.findTutorProfileByClerkId).toHaveBeenCalledWith("clerk_user_1");
    expect(profile).toEqual(buildProfile());
  });

  it("throws TutorProfileNotFoundError when there is no profile for the caller", async () => {
    const deps = buildDeps({ findTutorProfileByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createTutorsService(deps);

    await expect(service.getMyProfile("clerk_user_1")).rejects.toThrow(TutorProfileNotFoundError);
  });
});

describe("tutorsService.listPendingApplications", () => {
  it("delegates to listPendingTutorProfiles", async () => {
    const deps = buildDeps({ listPendingTutorProfiles: vi.fn().mockResolvedValue([buildProfile()]) });
    const service = createTutorsService(deps);

    const result = await service.listPendingApplications();

    expect(result).toEqual([buildProfile()]);
  });
});

describe("tutorsService.approveApplication / rejectApplication", () => {
  it("approves a pending application", async () => {
    const deps = buildDeps();
    const service = createTutorsService(deps);

    await service.approveApplication("tutor_profile_1");

    expect(deps.updateTutorProfileStatus).toHaveBeenCalledWith("tutor_profile_1", "APPROVED");
  });

  it("rejects a pending application", async () => {
    const deps = buildDeps();
    const service = createTutorsService(deps);

    await service.rejectApplication("tutor_profile_1");

    expect(deps.updateTutorProfileStatus).toHaveBeenCalledWith("tutor_profile_1", "REJECTED");
  });

  it("throws TutorProfileNotFoundError when the application doesn't exist", async () => {
    const deps = buildDeps({ findTutorProfileById: vi.fn().mockResolvedValue(null) });
    const service = createTutorsService(deps);

    await expect(service.approveApplication("missing")).rejects.toThrow(TutorProfileNotFoundError);
    expect(deps.updateTutorProfileStatus).not.toHaveBeenCalled();
  });

  it("throws ApplicationAlreadyDecidedError when the application isn't PENDING", async () => {
    const deps = buildDeps({
      findTutorProfileById: vi.fn().mockResolvedValue(buildProfile({ status: "APPROVED" })),
    });
    const service = createTutorsService(deps);

    await expect(service.rejectApplication("tutor_profile_1")).rejects.toThrow(
      ApplicationAlreadyDecidedError
    );
    expect(deps.updateTutorProfileStatus).not.toHaveBeenCalled();
  });
});
