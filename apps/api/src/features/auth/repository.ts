import { prisma, type Tenant, type Role, type User } from "@brightpath/db";
import { DEFAULT_TENANT_NAME, type RoleName } from "@brightpath/types";

export function findDefaultTenant(): Promise<Tenant> {
  return prisma.tenant.findUniqueOrThrow({ where: { name: DEFAULT_TENANT_NAME } });
}

export function findRoleByName(name: RoleName): Promise<Role> {
  return prisma.role.findUniqueOrThrow({ where: { name } });
}

// req.auth.userId (attached by requireAuth/requireRole) is the Clerk id, not
// User's own internal id -- any feature that needs to write against the
// caller's own User row (not just check their role) needs this first.
export function findUserByClerkId(clerkId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { clerkId } });
}

export interface UpsertUserInput {
  clerkId: string;
  tenantId: string;
  roleId: string;
  name: string;
  email: string;
  phone: string | null;
}

// Clerk may redeliver a webhook (at-least-once delivery), so this is keyed on
// the unique clerkId and is a no-op on repeat delivery rather than erroring.
export function upsertUserByClerkId(input: UpsertUserInput): Promise<User> {
  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    update: {},
    create: input,
  });
}
