import type { StudentProfile, TutorProfile } from "@brightpath/db";
import type { AssignStudentInput } from "@brightpath/types";
import type { AssignmentRecord, CreateAssignmentInput } from "./repository.js";

export class AdminNotFoundError extends Error {
  constructor(clerkId: string) {
    super(`No admin account found for ${clerkId}`);
    this.name = "AdminNotFoundError";
  }
}

export class StudentNotFoundError extends Error {
  constructor(id: string) {
    super(`No student found with id ${id}`);
    this.name = "StudentNotFoundError";
  }
}

// Covers both "no tutor with this id" and "tutor exists but isn't
// APPROVED" -- an admin can't assign a pending/rejected applicant, and both
// cases are the same "not a valid assignment target" condition to the caller.
export class TutorNotEligibleError extends Error {
  constructor(id: string) {
    super(`No approved tutor found with id ${id}`);
    this.name = "TutorNotEligibleError";
  }
}

export class AssignmentNotFoundError extends Error {
  constructor(id: string) {
    super(`No assignment found with id ${id}`);
    this.name = "AssignmentNotFoundError";
  }
}

export class AssignmentAlreadyEndedError extends Error {
  constructor(id: string) {
    super(`Assignment ${id} has already ended`);
    this.name = "AssignmentAlreadyEndedError";
  }
}

export interface AssignmentsServiceDeps {
  findUserByClerkId: (clerkId: string) => Promise<{ id: string } | null>;
  findStudentProfileById: (id: string) => Promise<StudentProfile | null>;
  findTutorProfileById: (id: string) => Promise<TutorProfile | null>;
  assignTutorToStudent: (input: CreateAssignmentInput) => Promise<AssignmentRecord>;
  endAssignment: (id: string) => Promise<AssignmentRecord>;
  findAssignmentById: (id: string) => Promise<AssignmentRecord | null>;
  listAssignments: () => Promise<AssignmentRecord[]>;
}

export function createAssignmentsService(deps: AssignmentsServiceDeps) {
  return {
    async assignTutor(
      adminClerkId: string,
      input: AssignStudentInput
    ): Promise<AssignmentRecord> {
      const admin = await deps.findUserByClerkId(adminClerkId);
      if (!admin) {
        throw new AdminNotFoundError(adminClerkId);
      }

      const student = await deps.findStudentProfileById(input.studentId);
      if (!student) {
        throw new StudentNotFoundError(input.studentId);
      }

      const tutor = await deps.findTutorProfileById(input.tutorId);
      if (!tutor || tutor.status !== "APPROVED") {
        throw new TutorNotEligibleError(input.tutorId);
      }

      return deps.assignTutorToStudent({
        studentId: input.studentId,
        tutorId: input.tutorId,
        assignedById: admin.id,
      });
    },

    async listAssignments(): Promise<AssignmentRecord[]> {
      return deps.listAssignments();
    },

    async getAssignment(id: string): Promise<AssignmentRecord> {
      const assignment = await deps.findAssignmentById(id);
      if (!assignment) {
        throw new AssignmentNotFoundError(id);
      }
      return assignment;
    },

    async unassign(id: string): Promise<AssignmentRecord> {
      const assignment = await deps.findAssignmentById(id);
      if (!assignment) {
        throw new AssignmentNotFoundError(id);
      }
      if (assignment.status !== "ACTIVE") {
        throw new AssignmentAlreadyEndedError(id);
      }
      return deps.endAssignment(id);
    },
  };
}
