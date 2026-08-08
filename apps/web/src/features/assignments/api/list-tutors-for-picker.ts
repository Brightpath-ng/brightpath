import { z } from "zod";
import { TutorApplicationSummarySchema, type TutorApplicationSummary } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

const ListApprovedTutorsSchema = z.array(TutorApplicationSummarySchema);

// Approved tutors only -- backs the assignment form's tutor picker.
export function listApprovedTutorsForPicker(): Promise<TutorApplicationSummary[]> {
  return apiFetch("/tutors/approved", ListApprovedTutorsSchema);
}
