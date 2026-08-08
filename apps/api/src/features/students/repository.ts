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

// Unscoped by parent -- admin-only (see GET /admin/students), for populating
// the tutor-assignment picker. listStudentProfilesByParentId stays as the
// parent-facing "my students" query; this is a deliberately separate
// function rather than an optional-parentId param on that one, so the two
// access patterns (mine vs. everyone's) can't be blurred into each other.
export function listAllStudentProfiles(): Promise<StudentProfile[]> {
  return prisma.studentProfile.findMany({ orderBy: { createdAt: "asc" } });
}

export function findStudentProfileById(id: string): Promise<StudentProfile | null> {
  return prisma.studentProfile.findUnique({ where: { id } });
}

export interface UpdateStudentProfileInput {
  name: string;
  school: string | null;
  class: string | null;
  learningGoals: string | null;
  learningChallenges: string | null;
}

export function updateStudentProfile(
  id: string,
  input: UpdateStudentProfileInput
): Promise<StudentProfile> {
  return prisma.studentProfile.update({ where: { id }, data: input });
}
