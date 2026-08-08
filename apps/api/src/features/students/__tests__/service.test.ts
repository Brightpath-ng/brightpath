import { describe, expect, it, vi } from "vitest";
import type { StudentProfile } from "@brightpath/db";
import type { AddStudentInput } from "@brightpath/types";
import {
  createStudentsService,
  ParentNotFoundError,
  StudentNotFoundError,
  type StudentsServiceDeps,
} from "../service.js";

function buildInput(overrides: Partial<AddStudentInput> = {}): AddStudentInput {
  return {
    name: "Ada Lovelace",
    ...overrides,
  };
}

function buildProfile(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: "student_profile_1",
    parentId: "db_user_1",
    name: "Ada Lovelace",
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

function buildDeps(overrides: Partial<StudentsServiceDeps> = {}): StudentsServiceDeps {
  return {
    findUserByClerkId: vi.fn().mockResolvedValue({ id: "db_user_1" }),
    createStudentProfile: vi.fn().mockResolvedValue(buildProfile()),
    listStudentProfilesByParentId: vi.fn().mockResolvedValue([]),
    listAllStudentProfiles: vi.fn().mockResolvedValue([]),
    findStudentProfileById: vi.fn().mockResolvedValue(buildProfile()),
    updateStudentProfile: vi.fn().mockResolvedValue(buildProfile()),
    ...overrides,
  };
}

describe("studentsService.addStudent", () => {
  it("resolves the parent's internal User id and creates the profile", async () => {
    const deps = buildDeps();
    const service = createStudentsService(deps);

    const result = await service.addStudent("clerk_user_1", buildInput());

    expect(deps.findUserByClerkId).toHaveBeenCalledWith("clerk_user_1");
    expect(deps.createStudentProfile).toHaveBeenCalledWith({
      parentId: "db_user_1",
      name: "Ada Lovelace",
      school: null,
      class: null,
      learningGoals: null,
      learningChallenges: null,
    });
    expect(result).toEqual(buildProfile());
  });

  it("passes optional fields through when provided", async () => {
    const deps = buildDeps();
    const service = createStudentsService(deps);

    await service.addStudent(
      "clerk_user_1",
      buildInput({
        school: "Corona Secondary School",
        class: "JSS 2",
        learningGoals: "Improve at Mathematics",
        learningChallenges: "Struggles with word problems",
      })
    );

    expect(deps.createStudentProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        school: "Corona Secondary School",
        class: "JSS 2",
        learningGoals: "Improve at Mathematics",
        learningChallenges: "Struggles with word problems",
      })
    );
  });

  it("throws ParentNotFoundError when the caller has no User row", async () => {
    const deps = buildDeps({ findUserByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createStudentsService(deps);

    await expect(service.addStudent("clerk_user_1", buildInput())).rejects.toThrow(
      ParentNotFoundError
    );
    expect(deps.createStudentProfile).not.toHaveBeenCalled();
  });
});

describe("studentsService.listMyStudents", () => {
  it("lists students for the caller's own parentId", async () => {
    const deps = buildDeps({
      listStudentProfilesByParentId: vi.fn().mockResolvedValue([buildProfile()]),
    });
    const service = createStudentsService(deps);

    const result = await service.listMyStudents("clerk_user_1");

    expect(deps.listStudentProfilesByParentId).toHaveBeenCalledWith("db_user_1");
    expect(result).toEqual([buildProfile()]);
  });

  it("throws ParentNotFoundError when the caller has no User row", async () => {
    const deps = buildDeps({ findUserByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createStudentsService(deps);

    await expect(service.listMyStudents("clerk_user_1")).rejects.toThrow(ParentNotFoundError);
    expect(deps.listStudentProfilesByParentId).not.toHaveBeenCalled();
  });
});

describe("studentsService.listAllStudents", () => {
  it("lists every student, unscoped by parent", async () => {
    const listAllStudentProfiles = vi.fn().mockResolvedValue([buildProfile()]);
    const deps = buildDeps({ listAllStudentProfiles });
    const service = createStudentsService(deps);

    const result = await service.listAllStudents();

    expect(listAllStudentProfiles).toHaveBeenCalled();
    expect(result).toEqual([buildProfile()]);
  });
});

describe("studentsService.getStudent", () => {
  it("returns the student when it belongs to the caller", async () => {
    const deps = buildDeps();
    const service = createStudentsService(deps);

    const result = await service.getStudent("clerk_user_1", "student_profile_1");

    expect(deps.findStudentProfileById).toHaveBeenCalledWith("student_profile_1");
    expect(result).toEqual(buildProfile());
  });

  it("throws StudentNotFoundError when no student has that id", async () => {
    const deps = buildDeps({ findStudentProfileById: vi.fn().mockResolvedValue(null) });
    const service = createStudentsService(deps);

    await expect(service.getStudent("clerk_user_1", "nope")).rejects.toThrow(
      StudentNotFoundError
    );
  });

  it("throws StudentNotFoundError when the student belongs to a different parent", async () => {
    const deps = buildDeps({
      findStudentProfileById: vi.fn().mockResolvedValue(buildProfile({ parentId: "someone_else" })),
    });
    const service = createStudentsService(deps);

    await expect(service.getStudent("clerk_user_1", "student_profile_1")).rejects.toThrow(
      StudentNotFoundError
    );
  });

  it("throws ParentNotFoundError when the caller has no User row", async () => {
    const deps = buildDeps({ findUserByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createStudentsService(deps);

    await expect(service.getStudent("clerk_user_1", "student_profile_1")).rejects.toThrow(
      ParentNotFoundError
    );
    expect(deps.findStudentProfileById).not.toHaveBeenCalled();
  });
});

describe("studentsService.updateStudent", () => {
  it("updates the student when it belongs to the caller", async () => {
    const deps = buildDeps();
    const service = createStudentsService(deps);

    await service.updateStudent(
      "clerk_user_1",
      "student_profile_1",
      buildInput({ school: "New School" })
    );

    expect(deps.updateStudentProfile).toHaveBeenCalledWith("student_profile_1", {
      name: "Ada Lovelace",
      school: "New School",
      class: null,
      learningGoals: null,
      learningChallenges: null,
    });
  });

  it("throws StudentNotFoundError when the student belongs to a different parent", async () => {
    const deps = buildDeps({
      findStudentProfileById: vi.fn().mockResolvedValue(buildProfile({ parentId: "someone_else" })),
    });
    const service = createStudentsService(deps);

    await expect(
      service.updateStudent("clerk_user_1", "student_profile_1", buildInput())
    ).rejects.toThrow(StudentNotFoundError);
    expect(deps.updateStudentProfile).not.toHaveBeenCalled();
  });

  it("throws ParentNotFoundError when the caller has no User row", async () => {
    const deps = buildDeps({ findUserByClerkId: vi.fn().mockResolvedValue(null) });
    const service = createStudentsService(deps);

    await expect(
      service.updateStudent("clerk_user_1", "student_profile_1", buildInput())
    ).rejects.toThrow(ParentNotFoundError);
    expect(deps.updateStudentProfile).not.toHaveBeenCalled();
  });
});
