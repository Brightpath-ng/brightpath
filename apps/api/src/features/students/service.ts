import type { StudentProfile } from "@brightpath/db";
import type { AddStudentInput } from "@brightpath/types";
import type { CreateStudentProfileInput, UpdateStudentProfileInput } from "./repository.js";

export class ParentNotFoundError extends Error {
  constructor(clerkId: string) {
    super(`No parent account found for ${clerkId}`);
    this.name = "ParentNotFoundError";
  }
}

// Thrown both when a student truly doesn't exist and when it exists but
// belongs to a different parent -- callers get 404 either way, never 403,
// so a parent can't tell "not found" apart from "not yours" and probe for
// other parents' children by id.
export class StudentNotFoundError extends Error {
  constructor(id: string) {
    super(`No student found with id ${id}`);
    this.name = "StudentNotFoundError";
  }
}

export interface StudentsServiceDeps {
  findUserByClerkId: (clerkId: string) => Promise<{ id: string } | null>;
  createStudentProfile: (input: CreateStudentProfileInput) => Promise<StudentProfile>;
  listStudentProfilesByParentId: (parentId: string) => Promise<StudentProfile[]>;
  findStudentProfileById: (id: string) => Promise<StudentProfile | null>;
  updateStudentProfile: (id: string, input: UpdateStudentProfileInput) => Promise<StudentProfile>;
}

export function createStudentsService(deps: StudentsServiceDeps) {
  async function requireOwnStudent(parentId: string, studentId: string): Promise<StudentProfile> {
    const student = await deps.findStudentProfileById(studentId);
    if (!student || student.parentId !== parentId) {
      throw new StudentNotFoundError(studentId);
    }
    return student;
  }

  return {
    async addStudent(parentClerkId: string, input: AddStudentInput): Promise<StudentProfile> {
      const parent = await deps.findUserByClerkId(parentClerkId);
      if (!parent) {
        throw new ParentNotFoundError(parentClerkId);
      }

      return deps.createStudentProfile({
        parentId: parent.id,
        name: input.name,
        school: input.school ?? null,
        class: input.class ?? null,
        learningGoals: input.learningGoals ?? null,
        learningChallenges: input.learningChallenges ?? null,
      });
    },

    async listMyStudents(parentClerkId: string): Promise<StudentProfile[]> {
      const parent = await deps.findUserByClerkId(parentClerkId);
      if (!parent) {
        throw new ParentNotFoundError(parentClerkId);
      }

      return deps.listStudentProfilesByParentId(parent.id);
    },

    async getStudent(parentClerkId: string, studentId: string): Promise<StudentProfile> {
      const parent = await deps.findUserByClerkId(parentClerkId);
      if (!parent) {
        throw new ParentNotFoundError(parentClerkId);
      }

      return requireOwnStudent(parent.id, studentId);
    },

    async updateStudent(
      parentClerkId: string,
      studentId: string,
      input: AddStudentInput
    ): Promise<StudentProfile> {
      const parent = await deps.findUserByClerkId(parentClerkId);
      if (!parent) {
        throw new ParentNotFoundError(parentClerkId);
      }

      await requireOwnStudent(parent.id, studentId);

      return deps.updateStudentProfile(studentId, {
        name: input.name,
        school: input.school ?? null,
        class: input.class ?? null,
        learningGoals: input.learningGoals ?? null,
        learningChallenges: input.learningChallenges ?? null,
      });
    },
  };
}
