import { prisma, type StudentProfile } from "@brightpath/db";

// findUserByClerkId is a shared auth primitive, not students-specific --
// reused here rather than duplicating the query.
export { findUserByClerkId } from "../auth/repository.js";

export interface CreateStudentProfileInput {
  parentId: string;
  name: string;
  school: string | null;
  class: string | null;
  learningGoals: string | null;
  learningChallenges: string | null;
}

export function createStudentProfile(input: CreateStudentProfileInput): Promise<StudentProfile> {
  return prisma.studentProfile.create({ data: input });
}

export function listStudentProfilesByParentId(parentId: string): Promise<StudentProfile[]> {
  return prisma.studentProfile.findMany({
    where: { parentId },
    orderBy: { createdAt: "asc" },
  });
}
