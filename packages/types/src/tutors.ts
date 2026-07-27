import { z } from "zod";

// PENDING/APPROVED/REJECTED rather than the blueprint's full 4-tier
// verification_tier enum (Section 11.1) -- tiers don't correspond to any real
// logic until the ID-verification/reference-checking follow-up slices exist.
export const TUTOR_APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const TutorApplicationStatusSchema = z.enum(TUTOR_APPLICATION_STATUSES);

export type TutorApplicationStatus = z.infer<typeof TutorApplicationStatusSchema>;

// The public application form's request body (apps/marketing -> apps/api,
// no auth -- the applicant doesn't have an account yet).
export const TutorApplicationInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  subjects: z.array(z.string().min(1)).min(1),
  qualifications: z.string().min(1),
  bio: z.string().max(2000).optional(),
});

export type TutorApplicationInput = z.infer<typeof TutorApplicationInputSchema>;

// A tutor's own profile, returned by GET /tutors/me.
export const TutorProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subjects: z.array(z.string()),
  qualifications: z.string(),
  bio: z.string().nullable(),
  status: TutorApplicationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TutorProfile = z.infer<typeof TutorProfileSchema>;

// The admin application-review list -- a TutorProfile joined with the
// applicant's name/email.
export const TutorApplicationSummarySchema = TutorProfileSchema.extend({
  name: z.string(),
  email: z.string().email(),
});

export type TutorApplicationSummary = z.infer<typeof TutorApplicationSummarySchema>;
