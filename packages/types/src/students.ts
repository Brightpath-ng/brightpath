import { z } from "zod";

// Matches the blueprint's own casing for learning_track (Section 9) rather
// than the UPPERCASE style used for TutorApplicationStatus -- mirrors
// TenantType's existing lowercase convention in the same schema instead.
export const LEARNING_TRACKS = ["tutor_led", "hybrid", "self_directed"] as const;

export const LearningTrackSchema = z.enum(LEARNING_TRACKS);

export type LearningTrack = z.infer<typeof LearningTrackSchema>;

// A parent adding a child -- school/class/learning goals and challenges are
// all optional, since a parent may not have all of that at hand yet.
export const AddStudentInputSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1).optional(),
  class: z.string().min(1).optional(),
  learningGoals: z.string().max(2000).optional(),
  learningChallenges: z.string().max(2000).optional(),
});

export type AddStudentInput = z.infer<typeof AddStudentInputSchema>;

// A child's profile, returned by POST /students and GET /students.
export const StudentProfileSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  name: z.string(),
  school: z.string().nullable(),
  class: z.string().nullable(),
  learningGoals: z.string().nullable(),
  learningChallenges: z.string().nullable(),
  learningTrack: LearningTrackSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;
