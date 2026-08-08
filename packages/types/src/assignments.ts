import { z } from "zod";

export const ASSIGNMENT_STATUSES = ["ACTIVE", "ENDED"] as const;

export const AssignmentStatusSchema = z.enum(ASSIGNMENT_STATUSES);

export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;

// Admin assigns (or reassigns) an approved tutor to a student.
export const AssignStudentInputSchema = z.object({
  studentId: z.string().min(1),
  tutorId: z.string().min(1),
});

export type AssignStudentInput = z.infer<typeof AssignStudentInputSchema>;

// Denormalized summaries nested in AssignmentSchema so list/detail views
// show who's on either side of the link without a second round trip.
const AssignmentStudentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AssignmentTutorSchema = z.object({
  id: z.string(),
  name: z.string(),
  subjects: z.array(z.string()),
});

export const AssignmentSchema = z.object({
  id: z.string(),
  status: AssignmentStatusSchema,
  assignedById: z.string(),
  assignedAt: z.string(),
  endedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  student: AssignmentStudentSchema,
  tutor: AssignmentTutorSchema,
});

export type Assignment = z.infer<typeof AssignmentSchema>;
