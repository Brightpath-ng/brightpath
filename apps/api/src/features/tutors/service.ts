import type { RoleName, TutorApplicationInput } from "@brightpath/types";
import type { CreateUserWithTutorProfileInput } from "./repository.js";

const TUTOR_ROLE: RoleName = "tutor";

export class DuplicateApplicationError extends Error {
  constructor(email: string) {
    super(`An application already exists for ${email}`);
    this.name = "DuplicateApplicationError";
  }
}

export interface TutorsServiceDeps {
  findUserByEmail: (email: string) => Promise<{ id: string } | null>;
  findClerkUserByEmail: (email: string) => Promise<{ id: string } | null>;
  createClerkUser: (input: {
    email: string;
    firstName: string;
    lastName?: string;
  }) => Promise<{ id: string }>;
  setClerkPublicMetadataRole: (clerkId: string, role: RoleName) => Promise<void>;
  findDefaultTenant: () => Promise<{ id: string }>;
  findRoleByName: (name: RoleName) => Promise<{ id: string }>;
  createUserWithTutorProfile: (
    input: CreateUserWithTutorProfileInput
  ) => Promise<{ user: { id: string }; tutorProfile: { id: string } }>;
}

export function createTutorsService(deps: TutorsServiceDeps) {
  return {
    async applyAsTutor(input: TutorApplicationInput) {
      const [existingUser, existingClerkUser] = await Promise.all([
        deps.findUserByEmail(input.email),
        deps.findClerkUserByEmail(input.email),
      ]);
      if (existingUser || existingClerkUser) {
        throw new DuplicateApplicationError(input.email);
      }

      const [tenant, role, clerkUser] = await Promise.all([
        deps.findDefaultTenant(),
        deps.findRoleByName(TUTOR_ROLE),
        deps.createClerkUser({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
        }),
      ]);

      // Set the role immediately, before the DB write -- so if the DB write
      // below fails, the Clerk user is at least correctly tagged (not left
      // to fall through the self-serve webhook path and become "parent").
      await deps.setClerkPublicMetadataRole(clerkUser.id, TUTOR_ROLE);

      return deps.createUserWithTutorProfile({
        clerkId: clerkUser.id,
        tenantId: tenant.id,
        roleId: role.id,
        name: `${input.firstName} ${input.lastName}`,
        email: input.email,
        phone: input.phone,
        subjects: input.subjects,
        qualifications: input.qualifications,
        bio: input.bio ?? null,
      });
    },
  };
}
