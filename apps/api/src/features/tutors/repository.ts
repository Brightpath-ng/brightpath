import { prisma, type User, type TutorProfile } from "@brightpath/db";

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

export function findTutorProfileByUserId(userId: string): Promise<TutorProfile | null> {
  return prisma.tutorProfile.findUnique({ where: { userId } });
}
