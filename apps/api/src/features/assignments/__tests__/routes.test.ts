import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.fn();

vi.mock("@clerk/backend", () => ({
  verifyToken: (...args: unknown[]) => verifyToken(...args),
}));

const now = new Date("2026-01-01T00:00:00.000Z");

const student = {
  id: "student_profile_1",
  parentId: "parent_user_1",
  name: "Amaka Obi",
  school: null,
  class: null,
  learningGoals: null,
  learningChallenges: null,
  learningTrack: "tutor_led",
  createdAt: now,
  updatedAt: now,
};

const approvedTutor = {
  id: "tutor_profile_1",
  userId: "tutor_user_1",
  subjects: ["Mathematics"],
  qualifications: "BSc Mathematics",
  bio: null,
  status: "APPROVED",
  createdAt: now,
  updatedAt: now,
};

const assignment = {
  id: "assignment_1",
  studentId: "student_profile_1",
  tutorId: "tutor_profile_1",
  status: "ACTIVE",
  assignedById: "admin_user_1",
  assignedAt: now,
  endedAt: null,
  createdAt: now,
  updatedAt: now,
  student: { id: "student_profile_1", name: "Amaka Obi" },
  tutor: { id: "tutor_profile_1", subjects: ["Mathematics"], user: { name: "Ngozi Adeyemi" } },
  assignedBy: { id: "admin_user_1", name: "Femi Adisa" },
};

const repositoryMocks = {
  findUserByClerkId: vi.fn().mockResolvedValue({ id: "admin_user_1" }),
  findStudentProfileById: vi.fn().mockResolvedValue(student),
  findTutorProfileById: vi.fn().mockResolvedValue(approvedTutor),
  assignTutorToStudent: vi.fn().mockResolvedValue(assignment),
  endAssignment: vi.fn().mockResolvedValue({ ...assignment, status: "ENDED", endedAt: now }),
  findAssignmentById: vi.fn().mockResolvedValue(assignment),
  listAssignments: vi.fn().mockResolvedValue([assignment]),
};
vi.mock("../repository.js", () => repositoryMocks);

function authHeader(role: string) {
  verifyToken.mockResolvedValue({ sub: "clerk_admin_1", publicMetadata: { role } });
  return { Authorization: "Bearer fake-token" };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CLERK_SECRET_KEY", "sk_test_fake");
  repositoryMocks.findUserByClerkId.mockResolvedValue({ id: "admin_user_1" });
  repositoryMocks.findStudentProfileById.mockResolvedValue(student);
  repositoryMocks.findTutorProfileById.mockResolvedValue(approvedTutor);
  repositoryMocks.assignTutorToStudent.mockResolvedValue(assignment);
  repositoryMocks.endAssignment.mockResolvedValue({ ...assignment, status: "ENDED", endedAt: now });
  repositoryMocks.findAssignmentById.mockResolvedValue(assignment);
  repositoryMocks.listAssignments.mockResolvedValue([assignment]);
});

const validInput = { studentId: "student_profile_1", tutorId: "tutor_profile_1" };

describe("POST /assignments", () => {
  it("returns 401 without a bearer token", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).post("/assignments").send(validInput);

    expect(response.status).toBe(401);
  });

  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments")
      .set(authHeader("tutor"))
      .send(validInput);

    expect(response.status).toBe(403);
  });

  it("creates an assignment and returns 201", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments")
      .set(authHeader("admin"))
      .send(validInput);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: "assignment_1",
      status: "ACTIVE",
      student: { id: "student_profile_1", name: "Amaka Obi" },
      tutor: { id: "tutor_profile_1", name: "Ngozi Adeyemi", subjects: ["Mathematics"] },
      assignedBy: { id: "admin_user_1", name: "Femi Adisa" },
    });
    expect(repositoryMocks.assignTutorToStudent).toHaveBeenCalledWith({
      studentId: "student_profile_1",
      tutorId: "tutor_profile_1",
      assignedById: "admin_user_1",
    });
  });

  it("returns 400 for an invalid body", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments")
      .set(authHeader("admin"))
      .send({ studentId: "" });

    expect(response.status).toBe(400);
    expect(repositoryMocks.assignTutorToStudent).not.toHaveBeenCalled();
  });

  it("returns 404 when the student doesn't exist", async () => {
    repositoryMocks.findStudentProfileById.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments")
      .set(authHeader("admin"))
      .send(validInput);

    expect(response.status).toBe(404);
  });

  it("returns 404 when the tutor isn't approved", async () => {
    repositoryMocks.findTutorProfileById.mockResolvedValue({ ...approvedTutor, status: "PENDING" });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments")
      .set(authHeader("admin"))
      .send(validInput);

    expect(response.status).toBe(404);
  });
});

describe("GET /assignments", () => {
  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/assignments").set(authHeader("parent"));

    expect(response.status).toBe(403);
  });

  it("returns the list of assignments for an admin", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/assignments").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([expect.objectContaining({ id: "assignment_1" })]);
  });

  it("returns 200 with an empty array when there are no assignments", async () => {
    repositoryMocks.listAssignments.mockResolvedValue([]);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp()).get("/assignments").set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /assignments/:id", () => {
  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/assignments/assignment_1")
      .set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("returns the assignment", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/assignments/assignment_1")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "assignment_1" });
  });

  it("returns 404 when no assignment has that id", async () => {
    repositoryMocks.findAssignmentById.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .get("/assignments/missing")
      .set(authHeader("admin"));

    expect(response.status).toBe(404);
  });
});

describe("POST /assignments/:id/end", () => {
  it("returns 403 for a non-admin caller", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments/assignment_1/end")
      .set(authHeader("tutor"));

    expect(response.status).toBe(403);
  });

  it("ends the assignment", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments/assignment_1/end")
      .set(authHeader("admin"));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "assignment_1", status: "ENDED" });
    expect(repositoryMocks.endAssignment).toHaveBeenCalledWith("assignment_1");
  });

  it("returns 404 when no assignment has that id", async () => {
    repositoryMocks.findAssignmentById.mockResolvedValue(null);
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments/missing/end")
      .set(authHeader("admin"));

    expect(response.status).toBe(404);
  });

  it("returns 409 when the assignment has already ended", async () => {
    repositoryMocks.findAssignmentById.mockResolvedValue({ ...assignment, status: "ENDED" });
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/assignments/assignment_1/end")
      .set(authHeader("admin"));

    expect(response.status).toBe(409);
  });
});
