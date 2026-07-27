import { prisma, type User, type TutorProfile, type TutorApplicationStatus } from "@brightpath/db";

// findDefaultTenant/findRoleByName are shared tenant/role primitives, not
// auth-specific -- reused here rather than duplicating the same queries.
export { findDefaultTenant, findRoleByName } from "../auth/repository.js";

export function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export interface CreateUserWithTutorProfileInput {
  clerkId: string;
  tenantId: string;
  roleId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  qualifications: string;
  bio: string | null;
}

// One transaction -- TutorProfile.userId requires the User to already exist,
// so this is two creates, not two independent writes that could leave a User
// with no profile if the second one failed.
export function createUserWithTutorProfile(
  input: CreateUserWithTutorProfileInput
): Promise<{ user: User; tutorProfile: TutorProfile }> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        clerkId: input.clerkId,
        tenantId: input.tenantId,
        roleId: input.roleId,
        name: input.name,
        email: input.email,
        phone: input.phone,
      },
    });
    const tutorProfile = await tx.tutorProfile.create({
      data: {
        userId: user.id,
        subjects: input.subjects,
        qualifications: input.qualifications,
        bio: input.bio,
      },
    });
    return { user, tutorProfile };
  });
}

// req.auth.userId (attached by the requireAuth/requireRole middleware) is the
// Clerk id, not TutorProfile's own userId FK (the internal User.id) -- this
// looks the profile up through the User.clerkId relation in one query.
export function findTutorProfileByClerkId(clerkId: string): Promise<TutorProfile | null> {
  return prisma.tutorProfile.findFirst({ where: { user: { clerkId } } });
}

export function findTutorProfileById(id: string): Promise<TutorProfile | null> {
  return prisma.tutorProfile.findUnique({ where: { id } });
}

export type TutorApplicationSummaryRecord = TutorProfile & {
  user: Pick<User, "name" | "email">;
};

export function listPendingTutorProfiles(): Promise<TutorApplicationSummaryRecord[]> {
  return prisma.tutorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function updateTutorProfileStatus(
  id: string,
  status: TutorApplicationStatus
): Promise<TutorProfile> {
  return prisma.tutorProfile.update({ where: { id }, data: { status } });
}
