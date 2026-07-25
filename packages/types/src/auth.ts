import { z } from "zod";

// The four Phase 1 roles (blueprint §14). Table-driven in the DB (packages/db's Role
// model), but the set of names Phase 1 actually assigns is fixed here so the seed
// script, the Clerk webhook, and apps/web's middleware all agree on the same values.
export const ROLE_NAMES = ["admin", "parent", "tutor", "student"] as const;

export const RoleNameSchema = z.enum(ROLE_NAMES);

export type RoleName = z.infer<typeof RoleNameSchema>;

export const DEFAULT_TENANT_NAME = "BrightPath Direct";

export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  tenantId: z.string(),
  roleId: z.string(),
  role: RoleNameSchema,
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;
