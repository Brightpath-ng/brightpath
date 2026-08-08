import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.fn();

vi.mock("@clerk/backend", () => ({
  verifyToken: (...args: unknown[]) => verifyToken(...args),
}));

const now = new Date("2026-01-01T00:00:00.000Z");
const studentProfile = {
  id: "student_profile_1",
  parentId: "db_user_1",
  name: "Ada Lovelace",
  school: null,
  class: null,
  learningGoals: null,
  learningChallenges: null,
  learningTrack: "tutor_led",
  createdAt: now,
  updatedAt: now,
};

const repositoryMocks = {
  findUserByClerkId: vi.fn().mockResolvedValue({ id: "db_user_1" }),
  createStudentProfile: vi.fn().mockResolvedValue(studentProfile),
  listStudentProfilesByParentId: vi.fn().mockResolvedValue([studentProfile]),
  listAllStudentProfiles: vi.fn().mockResolvedValue([studentProfile]),
  findStudentProfileById: vi.fn().mockResolvedValue(studentProfile),
  updateStudentProfile: vi.fn().mockResolvedValue(studentProfile),
};
vi.mock("../repository.js", () => repositoryMocks);

function authHeader(role: string) {
  verifyToken.mockResolvedValue({ sub: "clerk_user_1", publicMetadata: { role } });
  return { Authorization: "Bearer fake-token" };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CLERK_SECRET_KEY", "sk_test_fake");
  repositoryMocks.findUserByClerkId.mockResolvedValue({ id: "db_user_1" });
  repositoryMocks.createStudentProfile.mockResolvedValue(studentProfile);
  repositoryMocks.listStudentProfilesByParentId.mockResolvedValue([studentProfile]);
  repositoryMocks.listAllStudentProfiles.mockResolvedValue([studentProfile]);
  repositoryMocks.findStudentProfileById.mockResolvedValue(studentProfile);
  repositoryMocks.updateStudentProfile.mockResolvedValue(studentProfile);
});

describe("POST /students", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).post("/students").send({ name: "Ada Lovelace" });

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-parent caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/students")
      .set(authHeader("tutor"))
      .send({ name: "Ada Lovelace" });

    expect(response.status).toBe(403);
  });

  it("creates a student and returns 201", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/students")
      .set(authHeader("parent"))
      .send({ name: "Ada Lovelace" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: "student_profile_1", name: "Ada Lovelace" });
    expect(repositoryMocks.createStudentProfile).toHaveBeenCalledWith({
      parentId: "db_user_1",
      name: "Ada Lovelace",
      school: null,
      class: null,
      learningGoals: null,
      learningChallenges: null,
    });
  });

  it("returns 400 for an invalid body", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/students")
      .set(authHeader("parent"))
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(repositoryMocks.createStudentProfile).not.toHaveBeenCalled();
  });

  it("returns 404 when the caller has no matching User row", async () => {
    repositoryMocks.findUserByClerkId.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/students")
      .set(authHeader("parent"))
      .send({ name: "Ada Lovelace" });

    expect(response.status).toBe(404);
  });
});

describe("GET /students", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/students");

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-parent caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/students").set(authHeader("admin"));

    expect(response.status).toBe(403);
  });

  it("returns the caller's students", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/students").set(authHeader("parent"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([expect.objectContaining({ id: "student_profile_1" })]);
  });

  it("returns 200 with an empty array when the parent has no students yet", async () => {
    repositoryMocks.listStudentProfilesByParentId.mockResolvedValue([]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/students").set(authHeader("parent"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /students/:id", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/students/student_profile_1");

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-parent caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/students/student_profile_1")
      .set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("returns the student", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/students/student_profile_1")
      .set(authHeader("parent"));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "student_profile_1", name: "Ada Lovelace" });
  });

  it("returns 404 when the student belongs to a different parent", async () => {
    repositoryMocks.findStudentProfileById.mockResolvedValue({
      ...studentProfile,
      parentId: "someone_else",
    });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/students/student_profile_1")
      .set(authHeader("parent"));

    expect(response.status).toBe(404);
  });

  it("returns 404 when no student has that id", async () => {
    repositoryMocks.findStudentProfileById.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/students/does-not-exist")
      .set(authHeader("parent"));

    expect(response.status).toBe(404);
  });
});

describe("PATCH /students/:id", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .patch("/students/student_profile_1")
      .send({ name: "Ada Lovelace" });

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-parent caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .patch("/students/student_profile_1")
      .set(authHeader("admin"))
      .send({ name: "Ada Lovelace" });

    expect(response.status).toBe(403);
  });

  it("updates the student and returns 200", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .patch("/students/student_profile_1")
      .set(authHeader("parent"))
      .send({ name: "Ada Byron", school: "New School" });

    expect(response.status).toBe(200);
    expect(repositoryMocks.updateStudentProfile).toHaveBeenCalledWith("student_profile_1", {
      name: "Ada Byron",
      school: "New School",
      class: null,
      learningGoals: null,
      learningChallenges: null,
    });
  });

  it("returns 400 for an invalid body", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .patch("/students/student_profile_1")
      .set(authHeader("parent"))
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(repositoryMocks.updateStudentProfile).not.toHaveBeenCalled();
  });

  it("returns 404 when the student belongs to a different parent", async () => {
    repositoryMocks.findStudentProfileById.mockResolvedValue({
      ...studentProfile,
      parentId: "someone_else",
    });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .patch("/students/student_profile_1")
      .set(authHeader("parent"))
      .send({ name: "Ada Byron" });

    expect(response.status).toBe(404);
  });
});

describe("GET /admin/students", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/admin/students");

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/admin/students").set(authHeader("parent"));

    expect(response.status).toBe(403);
  });

  it("returns every student, not scoped to one parent", async () => {
    repositoryMocks.listAllStudentProfiles.mockResolvedValue([
      studentProfile,
      { ...studentProfile, id: "student_profile_2", parentId: "some_other_parent" },
    ]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/admin/students").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ id: "student_profile_1" }),
      expect.objectContaining({ id: "student_profile_2" }),
    ]);
  });

  it("returns 200 with an empty array when there are no students", async () => {
    repositoryMocks.listAllStudentProfiles.mockResolvedValue([]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/admin/students").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
