"use server";

import { revalidatePath } from "next/cache";
import { TutorProfileSchema } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export async function approveTutorApplication(id: string): Promise<void> {
  await apiFetch(`/tutors/applications/${id}/approve`, TutorProfileSchema, { method: "POST" });
  revalidatePath("/admin/tutors");
}

export async function rejectTutorApplication(id: string): Promise<void> {
  await apiFetch(`/tutors/applications/${id}/reject`, TutorProfileSchema, { method: "POST" });
  revalidatePath("/admin/tutors");
}
