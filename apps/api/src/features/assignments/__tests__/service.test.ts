import { describe, expect, it, vi } from "vitest";
import type { StudentProfile, TutorProfile } from "@brightpath/db";
import type { AssignStudentInput } from "@brightpath/types";
import {
  createAssignmentsService,
  AdminNotFoundError,
  StudentNotFoundError,
  TutorNotEligibleError,
  AssignmentNotFoundError,
  AssignmentAlreadyEndedError,
  type AssignmentsServiceDeps,
} from "../service.js";
import type { AssignmentRecord } from "../repository.js";

function buildInput(overrides: Partial<AssignStudentInput> = {}): AssignStudentInput {
  return {
    studentId: "student_profile_1",
    tutorId: "tutor_profile_1",
    ...overrides,
  };
}

function buildStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: "student_profile_1",
    parentId: "parent_user_1",
    name: "Amaka Obi",
    school: null,
    class: null,
    learningGoals: null,
    learningChallenges: null,
    learningTrack: "tutor_led",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function buildTutor(overrides: Partial<TutorProfile> = {}): TutorProfile {
  return {
    id: "tutor_profile_1",
    userId: "tutor_user_1",
    subjects: ["Mathematics"],
    qualifications: "BSc Mathematics",
    bio: null,
    status: "APPROVED",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function buildAssignment(overrides: Partial<AssignmentRecord> = {}): AssignmentRecord {
  return {
    id: "assignment_1",
    studentId: "student_profile_1",
    tutorId: "tutor_profile_1",
    status: "ACTIVE",
    assignedById: "admin_user_1",
    assignedAt: new Date("2026-01-01T00:00:00.000Z"),
    endedAt: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    student: { id: "student_profile_1", name: "Amaka Obi" },
    tutor: { id: "tutor_profile_1", subjects: ["Mathematics"], user: { name: "Ngozi Adeyemi" } },
    assignedBy: { id: "admin_user_1", name: "Femi Adisa" },
    ...overrides,
  };
}

function buildDeps(overrides: Partial<AssignmentsServiceDeps> = {}): AssignmentsServiceDeps {
  return {
    findUserByClerkId: vi.fn().mockResolvedValue({ id: "admin_user_1" }),
    findStudentProfileById: vi.fn().mockResolvedValue(buildStudent()),
    findTutorProfileById: vi.fn().mockResolvedValue(buildTutor()),
    assignTutorToStudent: vi.fn().mockResolvedValue(buildAssignment()),
    endAssignment: vi.fn().mockResolvedValue(buildAssignment({ status: "ENDED", endedAt: new Date() })),
    findAssignmentById: vi.fn().mockResolvedValue(buildAssignment()),
    listAssignments: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe("assignmentsService.assignTutor", () => {
  it("resolves the admin, verifies the student and tutor, and creates the assignment", async () => {
    const deps = buildDeps();
    const service = createAssignmentsService(deps);

    const result = await service.assignTutor("clerk_admin_1", buildInput());

    expect(deps.findUserByClerkId).toHaveBeenCalledWith("clerk_admin_1");
    expect(deps.findStudentProfileById).toHaveBeenCalledWith("student_profile_1");
    expect(deps.findTutorProfileById).toHaveBeenCalledWith("tutor_profile_1");
    expect(deps.assignTutorToStudent).toHaveBeenCalledWith({
      studentId: "student_profile_1",
      tutorId: "tutor_profile_1",
      assignedById: "admin_user_1",
    });
    expect(result).toEqual(buildAssignment());
  });

  it("throws AdminNotFoundError when the caller has no User row", async () => {
    const deps = buildDeps({ findUserByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createAssignmentsService(deps);

    await expect(service.assignTutor("clerk_admin_1", buildInput())).rejects.toThrow(
      AdminNotFoundError
    );
    expect(deps.assignTutorToStudent).not.toHaveBeenCalled();
  });

  it("throws StudentNotFoundError when no student has that id", async () => {
    const deps = buildDeps({ findStudentProfileById: vi.fn().mockResolvedValue(null) });
    const service = createAssignmentsService(deps);

    await expect(service.assignTutor("clerk_admin_1", buildInput())).rejects.toThrow(
      StudentNotFoundError
    );
    expect(deps.assignTutorToStudent).not.toHaveBeenCalled();
  });

  it("throws TutorNotEligibleError when no tutor has that id", async () => {
    const deps = buildDeps({ findTutorProfileById: vi.fn().mockResolvedValue(null) });
    const service = createAssignmentsService(deps);

    await expect(service.assignTutor("clerk_admin_1", buildInput())).rejects.toThrow(
      TutorNotEligibleError
    );
    expect(deps.assignTutorToStudent).not.toHaveBeenCalled();
  });

  it("throws TutorNotEligibleError when the tutor isn't APPROVED", async () => {
    const deps = buildDeps({
      findTutorProfileById: vi.fn().mockResolvedValue(buildTutor({ status: "PENDING" })),
    });
    const service = createAssignmentsService(deps);

    await expect(service.assignTutor("clerk_admin_1", buildInput())).rejects.toThrow(
      TutorNotEligibleError
    );
    expect(deps.assignTutorToStudent).not.toHaveBeenCalled();
  });
});

describe("assignmentsService.listAssignments", () => {
  it("delegates to the repository", async () => {
    const deps = buildDeps({ listAssignments: vi.fn().mockResolvedValue([buildAssignment()]) });
    const service = createAssignmentsService(deps);

    const result = await service.listAssignments();

    expect(result).toEqual([buildAssignment()]);
  });
});

describe("assignmentsService.getAssignment", () => {
  it("returns the assignment when it exists", async () => {
    const deps = buildDeps();
    const service = createAssignmentsService(deps);

    const result = await service.getAssignment("assignment_1");

    expect(deps.findAssignmentById).toHaveBeenCalledWith("assignment_1");
    expect(result).toEqual(buildAssignment());
  });

  it("throws AssignmentNotFoundError when no assignment has that id", async () => {
    const deps = buildDeps({ findAssignmentById: vi.fn().mockResolvedValue(null) });
    const service = createAssignmentsService(deps);

    await expect(service.getAssignment("missing")).rejects.toThrow(AssignmentNotFoundError);
  });
});

describe("assignmentsService.unassign", () => {
  it("ends an active assignment", async () => {
    const deps = buildDeps();
    const service = createAssignmentsService(deps);

    await service.unassign("assignment_1");

    expect(deps.endAssignment).toHaveBeenCalledWith("assignment_1");
  });

  it("throws AssignmentNotFoundError when no assignment has that id", async () => {
    const deps = buildDeps({ findAssignmentById: vi.fn().mockResolvedValue(null) });
    const service = createAssignmentsService(deps);

    await expect(service.unassign("missing")).rejects.toThrow(AssignmentNotFoundError);
    expect(deps.endAssignment).not.toHaveBeenCalled();
  });

  it("throws AssignmentAlreadyEndedError when the assignment isn't ACTIVE", async () => {
    const deps = buildDeps({
      findAssignmentById: vi.fn().mockResolvedValue(buildAssignment({ status: "ENDED" })),
    });
    const service = createAssignmentsService(deps);

    await expect(service.unassign("assignment_1")).rejects.toThrow(AssignmentAlreadyEndedError);
    expect(deps.endAssignment).not.toHaveBeenCalled();
  });
});
