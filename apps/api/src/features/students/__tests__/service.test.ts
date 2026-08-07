import { describe, expect, it, vi } from "vitest";
import type { StudentProfile } from "@brightpath/db";
import type { AddStudentInput } from "@brightpath/types";
import { createStudentsService, ParentNotFoundError, type StudentsServiceDeps } from "../service.js";

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
