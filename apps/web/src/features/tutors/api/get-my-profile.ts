import { TutorProfileSchema, type TutorProfile } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export function getMyTutorProfile(): Promise<TutorProfile> {
  return apiFetch("/tutors/me", TutorProfileSchema);
}
