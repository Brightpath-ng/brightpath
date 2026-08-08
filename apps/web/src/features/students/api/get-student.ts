import { StudentProfileSchema, type StudentProfile } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

export function getStudent(id: string): Promise<StudentProfile> {
  return apiFetch(`/students/${id}`, StudentProfileSchema);
}
