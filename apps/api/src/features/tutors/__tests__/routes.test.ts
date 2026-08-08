import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateUserMetadata = vi.fn().mockResolvedValue(undefined);
const verifyToken = vi.fn();

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({ users: { updateUserMetadata } }),
  verifyToken: (...args: unknown[]) => verifyToken(...args),
}));

const clerkLibMocks = {
  findClerkUserByEmail: vi.fn().mockResolvedValue(null),
  createClerkUser: vi.fn().mockResolvedValue({ id: "clerk_user_1" }),
};
vi.mock("../../../lib/clerk.js", () => clerkLibMocks);

const now = new Date("2026-01-01T00:00:00.000Z");
const pendingProfile = {
  id: "tutor_profile_1",
  userId: "db_user_1",
  subjects: ["Mathematics"],
  qualifications: "BSc Mathematics, 5 years tutoring experience",
  bio: null,
  status: "PENDING",
  createdAt: now,
  updatedAt: now,
};

const repositoryMocks = {
  findUserByEmail: vi.fn().mockResolvedValue(null),
  findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
  findRoleByName: vi.fn().mockResolvedValue({ id: "role_tutor" }),
  createUserWithTutorProfile: vi
    .fn()
    .mockResolvedValue({ user: { id: "db_user_1" }, tutorProfile: { id: "tutor_profile_1" } }),
  findTutorProfileByClerkId: vi.fn().mockResolvedValue(pendingProfile),
  findTutorProfileById: vi.fn().mockResolvedValue(pendingProfile),
  listTutorProfilesByStatus: vi
    .fn()
    .mockResolvedValue([{ ...pendingProfile, user: { name: "Ngozi Adeyemi", email: "ngozi@example.com" } }]),
  updateTutorProfileStatus: vi.fn().mockResolvedValue({ ...pendingProfile, status: "APPROVED" }),
};
vi.mock("../repository.js", () => repositoryMocks);

function authHeader(role: string) {
  verifyToken.mockResolvedValue({ sub: "clerk_user_1", publicMetadata: { role } });
  return { Authorization: "Bearer fake-token" };
}

const validApplication = {
  firstName: "Ngozi",
  lastName: "Adeyemi",
  email: "ngozi@example.com",
  phone: "+2348012345678",
  subjects: ["Mathematics"],
  qualifications: "BSc Mathematics, 5 years tutoring experience",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CLERK_SECRET_KEY", "sk_test_fake");
  clerkLibMocks.findClerkUserByEmail.mockResolvedValue(null);
  clerkLibMocks.createClerkUser.mockResolvedValue({ id: "clerk_user_1" });
  repositoryMocks.findUserByEmail.mockResolvedValue(null);
  repositoryMocks.findDefaultTenant.mockResolvedValue({ id: "tenant_1" });
  repositoryMocks.findRoleByName.mockResolvedValue({ id: "role_tutor" });
  repositoryMocks.createUserWithTutorProfile.mockResolvedValue({
    user: { id: "db_user_1" },
    tutorProfile: { id: "tutor_profile_1" },
  });
  repositoryMocks.findTutorProfileByClerkId.mockResolvedValue(pendingProfile);
  repositoryMocks.findTutorProfileById.mockResolvedValue(pendingProfile);
  repositoryMocks.listTutorProfilesByStatus.mockResolvedValue([
    { ...pendingProfile, user: { name: "Ngozi Adeyemi", email: "ngozi@example.com" } },
  ]);
  repositoryMocks.updateTutorProfileStatus.mockResolvedValue({ ...pendingProfile, status: "APPROVED" });
});

describe("POST /tutors/apply", () => {
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

describe("GET /tutors/me", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/me");

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-tutor caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/me").set(authHeader("parent"));

    expect(response.status).toBe(403);
  });

  it("returns the caller's tutor profile", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/me").set(authHeader("tutor"));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "tutor_profile_1", status: "PENDING" });
  });

  it("returns 404 when the caller has no tutor profile", async () => {
    repositoryMocks.findTutorProfileByClerkId.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/me").set(authHeader("tutor"));

    expect(response.status).toBe(404);
  });
});

describe("GET /tutors/applications", () => {
  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/tutors/applications")
      .set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("returns the pending applications for an admin", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/tutors/applications")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ id: "tutor_profile_1", name: "Ngozi Adeyemi", email: "ngozi@example.com" }),
    ]);
  });

  it("returns 200 with an empty array when there are no pending applications", async () => {
    repositoryMocks.listTutorProfilesByStatus.mockResolvedValue([]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/tutors/applications")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /tutors/approved", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/approved");

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/approved").set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("returns approved tutors for an admin", async () => {
    repositoryMocks.listTutorProfilesByStatus.mockResolvedValue([
      {
        ...pendingProfile,
        status: "APPROVED",
        user: { name: "Ngozi Adeyemi", email: "ngozi@example.com" },
      },
    ]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/approved").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ id: "tutor_profile_1", status: "APPROVED" }),
    ]);
    expect(repositoryMocks.listTutorProfilesByStatus).toHaveBeenCalledWith("APPROVED");
  });

  it("returns 200 with an empty array when there are no approved tutors", async () => {
    repositoryMocks.listTutorProfilesByStatus.mockResolvedValue([]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/tutors/approved").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /tutors/applications/:id/approve", () => {
  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/applications/tutor_profile_1/approve")
      .set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("approves a pending application", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/applications/tutor_profile_1/approve")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(repositoryMocks.updateTutorProfileStatus).toHaveBeenCalledWith(
      "tutor_profile_1",
      "APPROVED"
    );
  });

  it("returns 404 for an unknown application", async () => {
    repositoryMocks.findTutorProfileById.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/applications/missing/approve")
      .set(authHeader("admin"));

    expect(response.status).toBe(404);
  });

  it("returns 409 when the application was already decided", async () => {
    repositoryMocks.findTutorProfileById.mockResolvedValue({ ...pendingProfile, status: "REJECTED" });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/applications/tutor_profile_1/approve")
      .set(authHeader("admin"));

    expect(response.status).toBe(409);
  });
});

describe("POST /tutors/applications/:id/reject", () => {
  it("rejects a pending application", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/tutors/applications/tutor_profile_1/reject")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(repositoryMocks.updateTutorProfileStatus).toHaveBeenCalledWith(
      "tutor_profile_1",
      "REJECTED"
    );
  });
});
