import { prisma, type Assignment } from "@brightpath/db";

// findUserByClerkId/findStudentProfileById/findTutorProfileById are shared
// primitives, not assignments-specific -- reused here rather than
// duplicating the same queries (matches how students/repository.ts already
// re-exports findUserByClerkId from auth/repository.ts).
export { findUserByClerkId } from "../auth/repository.js";
export { findStudentProfileById } from "../students/repository.js";
export { findTutorProfileById } from "../tutors/repository.js";

const assignmentInclude = {
  student: { select: { id: true, name: true } },
  tutor: {
    select: {
      id: true,
      subjects: true,
      user: { select: { name: true } },
    },
  },
} as const;

export type AssignmentRecord = Assignment & {
  student: { id: string; name: string };
  tutor: { id: string; subjects: string[]; user: { name: string } };
};

export interface CreateAssignmentInput {
  studentId: string;
  tutorId: string;
  assignedById: string;
}

// "Assign" and "reassign" are the same action -- ending any existing active
// assignment for this student and creating the new one happen in one
// transaction, so a student is never left with two ACTIVE rows even under
// concurrent requests, and reassigning always leaves the prior assignment
// as history (ENDED) rather than overwriting it.
export function assignTutorToStudent(input: CreateAssignmentInput): Promise<AssignmentRecord> {
  return prisma.$transaction(async (tx) => {
    await tx.assignment.updateMany({
      where: { studentId: input.studentId, status: "ACTIVE" },
      data: { status: "ENDED", endedAt: new Date() },
    });
    return tx.assignment.create({
      data: input,
      include: assignmentInclude,
    });
  });
}

export function endAssignment(id: string): Promise<AssignmentRecord> {
  return prisma.assignment.update({
    where: { id },
    data: { status: "ENDED", endedAt: new Date() },
    include: assignmentInclude,
  });
}

export function findAssignmentById(id: string): Promise<AssignmentRecord | null> {
  return prisma.assignment.findUnique({
    where: { id },
    include: assignmentInclude,
  });
}

export function listAssignments(): Promise<AssignmentRecord[]> {
  return prisma.assignment.findMany({
    include: assignmentInclude,
    orderBy: { createdAt: "desc" },
  });
}
