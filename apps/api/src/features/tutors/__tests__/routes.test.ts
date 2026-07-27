import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateUserMetadata = vi.fn().mockResolvedValue(undefined);

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({ users: { updateUserMetadata } }),
}));

const clerkLibMocks = {
  findClerkUserByEmail: vi.fn().mockResolvedValue(null),
  createClerkUser: vi.fn().mockResolvedValue({ id: "clerk_user_1" }),
};
vi.mock("../../../lib/clerk.js", () => clerkLibMocks);

const repositoryMocks = {
  findUserByEmail: vi.fn().mockResolvedValue(null),
  findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
  findRoleByName: vi.fn().mockResolvedValue({ id: "role_tutor" }),
  createUserWithTutorProfile: vi
    .fn()
    .mockResolvedValue({ user: { id: "db_user_1" }, tutorProfile: { id: "tutor_profile_1" } }),
};
vi.mock("../repository.js", () => repositoryMocks);

const validApplication = {
  firstName: "Ngozi",
  lastName: "Adeyemi",
  email: "ngozi@example.com",
  phone: "+2348012345678",
  subjects: ["Mathematics"],
  qualifications: "BSc Mathematics, 5 years tutoring experience",
};

describe("POST /tutors/apply", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clerkLibMocks.findClerkUserByEmail.mockResolvedValue(null);
    clerkLibMocks.createClerkUser.mockResolvedValue({ id: "clerk_user_1" });
    repositoryMocks.findUserByEmail.mockResolvedValue(null);
    repositoryMocks.findDefaultTenant.mockResolvedValue({ id: "tenant_1" });
    repositoryMocks.findRoleByName.mockResolvedValue({ id: "role_tutor" });
    repositoryMocks.createUserWithTutorProfile.mockResolvedValue({
      user: { id: "db_user_1" },
      tutorProfile: { id: "tutor_profile_1" },
    });
  });

  it("creates a tutor application and returns 201", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).post("/tutors/apply").send(validApplication);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ userId: "db_user_1", tutorProfileId: "tutor_profile_1" });
    expect(updateUserMetadata).toHaveBeenCalledWith("clerk_user_1", {
      publicMetadata: { role: "tutor" },
    });
  });

  it("returns 400 for an invalid application body", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/apply")
      .send({ ...validApplication, email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(repositoryMocks.createUserWithTutorProfile).not.toHaveBeenCalled();
  });

  it("returns 400 when subjects is empty", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/apply")
      .send({ ...validApplication, subjects: [] });

    expect(response.status).toBe(400);
  });

  it("returns 409 when a User already exists for the email", async () => {
    repositoryMocks.findUserByEmail.mockResolvedValue({ id: "existing_user" });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).post("/tutors/apply").send(validApplication);

    expect(response.status).toBe(409);
    expect(clerkLibMocks.createClerkUser).not.toHaveBeenCalled();
  });
});
