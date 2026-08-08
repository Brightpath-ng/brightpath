import { z } from "zod";
import { AssignmentSchema, type Assignment } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

const ListAssignmentsSchema = z.array(AssignmentSchema);

export function listAssignments(): Promise<Assignment[]> {
  return apiFetch("/assignments", ListAssignmentsSchema);
}
