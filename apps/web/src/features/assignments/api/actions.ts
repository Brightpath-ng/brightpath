"use server";

import { revalidatePath } from "next/cache";
import { AssignmentSchema, type AssignStudentInput, type Assignment } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export async function assignTutor(input: AssignStudentInput): Promise<Assignment> {
  const assignment = await apiFetch("/assignments", AssignmentSchema, {
    method: "POST",
    body: JSON.stringify(input),
  });
  revalidatePath("/admin/assignments");
  return assignment;
}

export async function endAssignment(id: string): Promise<Assignment> {
  const assignment = await apiFetch(`/assignments/${id}/end`, AssignmentSchema, {
    method: "POST",
  });
  revalidatePath("/admin/assignments");
  revalidatePath(`/admin/assignments/${id}`);
  return assignment;
}
