import type { StudentProfile } from "@brightpath/db";
import type { AddStudentInput } from "@brightpath/types";
import type { CreateStudentProfileInput } from "./repository.js";

export class ParentNotFoundError extends Error {
  constructor(clerkId: string) {
    super(`No parent account found for ${clerkId}`);
    this.name = "ParentNotFoundError";
  }
}

export interface StudentsServiceDeps {
  findUserByClerkId: (clerkId: string) => Promise<{ id: string } | null>;
  createStudentProfile: (input: CreateStudentProfileInput) => Promise<StudentProfile>;
  listStudentProfilesByParentId: (parentId: string) => Promise<StudentProfile[]>;
}

export function createStudentsService(deps: StudentsServiceDeps) {
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
  };
}
