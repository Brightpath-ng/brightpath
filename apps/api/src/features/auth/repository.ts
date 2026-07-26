import { prisma, type Tenant, type Role, type User } from "@brightpath/db";
import { DEFAULT_TENANT_NAME, type RoleName } from "@brightpath/types";

export function findDefaultTenant(): Promise<Tenant> {
  return prisma.tenant.findUniqueOrThrow({ where: { name: DEFAULT_TENANT_NAME } });
}

export function findRoleByName(name: RoleName): Promise<Role> {
  return prisma.role.findUniqueOrThrow({ where: { name } });
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
