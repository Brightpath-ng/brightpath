import { AssignmentSchema, type Assignment } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export function getAssignment(id: string): Promise<Assignment> {
  return apiFetch(`/assignments/${id}`, AssignmentSchema);
}
