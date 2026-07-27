import { z } from "zod";
import { TutorApplicationSummarySchema, type TutorApplicationSummary } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

const ListApplicationsSchema = z.array(TutorApplicationSummarySchema);

export function listPendingApplications(): Promise<TutorApplicationSummary[]> {
  return apiFetch("/tutors/applications", ListApplicationsSchema);
}
