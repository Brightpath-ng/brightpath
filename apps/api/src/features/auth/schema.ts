import { z } from "zod";
import { RoleNameSchema } from "@brightpath/types";

// Only the fields this feature actually reads from Clerk's user.created event.
// Clerk's real payload has many more fields; add them here if/when a feature
// needs them, rather than modeling the whole event shape speculatively.
export const ClerkUserCreatedEventSchema = z.object({
  type: z.literal("user.created"),
  data: z.object({
    id: z.string(),
    primary_email_address_id: z.string().nullable(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string().email(),
      })
    ),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    phone_numbers: z.array(z.object({ phone_number: z.string() })),
    // Present when the API created this Clerk user directly (tutor
    // applications, admin seeding) rather than a genuine self-serve sign-up
    // -- see service.ts's handleUserCreated for why this matters.
    public_metadata: z.object({ role: RoleNameSchema.optional() }).optional(),
  }),
});

export type ClerkUserCreatedEvent = z.infer<typeof ClerkUserCreatedEventSchema>;
