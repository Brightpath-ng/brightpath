"use server";

import { revalidatePath } from "next/cache";
import { StudentProfileSchema, type AddStudentInput, type StudentProfile } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export async function addStudent(input: AddStudentInput): Promise<StudentProfile> {
  const student = await apiFetch("/students", StudentProfileSchema, {
    method: "POST",
    body: JSON.stringify(input),
  });
  revalidatePath("/parent/students");
  return student;
}

export async function updateStudent(id: string, input: AddStudentInput): Promise<StudentProfile> {
  const student = await apiFetch(`/students/${id}`, StudentProfileSchema, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  revalidatePath("/parent/students");
  revalidatePath(`/parent/students/${id}`);
  return student;
}
