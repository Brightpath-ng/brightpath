"use server";

import { revalidatePath } from "next/cache";
import { StudentProfileSchema, type AddStudentInput } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export async function addStudent(input: AddStudentInput): Promise<void> {
  await apiFetch("/students", StudentProfileSchema, {
    method: "POST",
    body: JSON.stringify(input),
  });
  revalidatePath("/parent/students");
}
